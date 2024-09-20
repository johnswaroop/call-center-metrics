"use server";

import fs from "fs";
import path from "path";
import os from "os";
import OpenAI from "openai";
import Call from "@/models/call";
import CONNECT_DB from "@/lib/connect-db";

const openai = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
});

const getFileExtensionFromMimeType = (mimeType: string) => {
  const mimeTypes: { [key: string]: string } = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "text/plain": "txt",
    "application/pdf": "pdf",
    // Add more MIME types and extensions as needed
  };
  return mimeTypes[mimeType] || ""; // Default to empty string if not found
};

// Function to convert Base64 URL to temporary file
const base64ToTempFile = async (base64URL: string, name: string) => {
  // Extract MIME type and Base64 data from URL

  const url = base64URL.split(",");
  const mimeType = url[0].split(":")[1].split(";")[0]; // Extract MIME type
  const base64Data = url[1]; // Extract Base64 data
  const fileExtension = getFileExtensionFromMimeType(mimeType); // Determine file extension

  if (!fileExtension) {
    throw new Error("Unsupported MIME type");
  }

  // Create a temporary file path with the correct extension
  const tempFilePath = path.join(
    os.tmpdir(),
    `file-${Date.now()}-${name}.${fileExtension}`
  );

  // Ensure './audio/' directory exists
  const audioDirectory = "./audio";
  if (!fs.existsSync(audioDirectory)) {
    fs.mkdirSync(audioDirectory, { recursive: true });
  }

  // Create the file path in the './audio/' directory with the correct extension
  const audioFilePath = path.join(
    audioDirectory,
    `audio-${Date.now()}-${name}.${fileExtension}`
  );

  console.log(audioFilePath);

  try {
    // Write the Base64 data to the temporary file
    const saveTempFile = fs.promises.writeFile(tempFilePath, base64Data, {
      encoding: "base64",
    });

    // Write the Base64 data to the './audio/' directory
    const saveAudio = fs.promises.writeFile(audioFilePath, base64Data, {
      encoding: "base64",
    });

    await Promise.all([saveTempFile, saveAudio]);

    return { tempFilePath, audioFilePath };
  } catch (error) {
    console.error("Error writing files:", error);
    throw error;
  }
};

const saveToDB = async (
  callName: string,
  transcript: string,
  email: string,
  path: string
) => {
  CONNECT_DB();
  const entry = new Call({ callName, transcript, email, audioFileUrl: path });
  const res = await entry.save();
  return res;
};

// Function to perform transcription
export const action_transcribeAudio = async (
  callName: string,
  email: string,
  base64URL: string
) => {
  // Converting base64 URL to a temporary file
  const { tempFilePath, audioFilePath } = await base64ToTempFile(
    base64URL,
    callName
  );

  try {
    // Running the transcription
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-1",
    });

    // Outputting the result
    console.log("Transcription:", transcription);

    // Optionally, delete the temporary file after transcription
    fs.promises.unlink(tempFilePath);

    //save transcription
    const res = await saveToDB(
      callName,
      transcription.text,
      email,
      audioFilePath
    );
    if (res) {
      return {
        dbres: JSON.parse(JSON.stringify(res)),
        transcription: transcription.text,
      };
    }
  } catch (error) {
    console.error("Error during transcription:", error);
  }
};
