// app/api/upload/route.js
import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";

// Disable the default bodyParser for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = "./public/uploads"; // You need to ensure this directory exists

async function parseForm(req) {
  const form = formidable({ multiples: true, uploadDir, keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
}

export async function POST(req) {
  try {
    const { files } = await parseForm(req);

    if (!files.file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const filePath = files.file.filepath; // Temporary uploaded file path
    const originalFileName = files.file.originalFilename; // Original file name

    // Optionally, move or rename the file here if needed
    const newFilePath = `${uploadDir}/${originalFileName}`;
    fs.renameSync(filePath, newFilePath);

    return NextResponse.json({ message: "File uploaded successfully!" });
  } catch (err) {
    console.error("File upload error:", err);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
