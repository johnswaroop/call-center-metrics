"use client";
import { action_transcribeAudio } from "@/actions/transcribe";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import ProcessingSteps from "./processingSteps";
import action_summary from "@/actions/gpt/summary";
import action_keywords from "@/actions/gpt/keywords";
import action_sop from "@/actions/gpt/sop";
import { IProcessSteps } from "@/actions/types";
import sendMail from "@/actions/sendEmail";
import { Textarea } from "@/components/ui/textarea";
import action_insights from "@/actions/gpt/insights";

export function DialogDemo() {
  const [callName, setcallName] = useState("");
  const [email, setemail] = useState("");
  const [sopSteps, setSop] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | ArrayBuffer | null>(
    ""
  );

  const [processSteps, setprocessSteps] = useState<IProcessSteps>({
    Transcription: { active: false, complete: false },
    Summary: { active: false, complete: false },
    "Keyword Analysis": { active: false, complete: false },
    "SOP Processing": { active: false, complete: false },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();

        // When the file is read, this event is triggered
        reader.onload = () => {
          const base64 = reader.result;
          setSelectedFile(base64);
        };

        // Read the file as a data URL
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      console.log(`Uploading file`);
      setprocessSteps((st) => {
        st["Transcription"].active = true;
        return { ...st };
      });
      const res = await action_transcribeAudio(
        callName,
        email,
        `${selectedFile}`
      );

      console.log(`Uploading complete`);
      setprocessSteps((st) => {
        st["Transcription"].complete = true;
        st["Summary"].active = true;
        st["SOP Processing"].active = true;
        st["Keyword Analysis"].active = true;
        return { ...st };
      });

      const gen_summary = async () => {
        console.log(`generating summary`);
        const summary = await action_summary(
          res?.dbres._id,
          res?.transcription
        );
        console.log("summary complete");
        setprocessSteps((st) => {
          st["Summary"].complete = true;
          return { ...st };
        });
        return summary;
      };
      const gen_keywords = async () => {
        console.log(`generating keywords`);
        const keywords = await action_keywords(
          res?.dbres._id,
          res?.transcription
        );
        console.log("keywords complete");
        setprocessSteps((st) => {
          st["Keyword Analysis"].complete = true;
          return { ...st };
        });
        return keywords;
      };
      const gen_sop = async () => {
        console.log(`generating SOP`);
        const sop = await action_sop(
          res?.dbres._id,
          res?.transcription,
          sopSteps
        );
        console.log("SOP complete");
        setprocessSteps((st) => {
          st["SOP Processing"].complete = true;
          return { ...st };
        });
        return sop;
      };

      const fulldata = await Promise.all([
        gen_summary(),
        gen_keywords(),
        gen_sop(),
      ]);
      console.log(fulldata);
      await sendMail(email, res?.dbres._id);
      setprocessSteps({
        Transcription: { active: false, complete: false },
        Summary: { active: false, complete: false },
        "Keyword Analysis": { active: false, complete: false },
        "SOP Processing": { active: false, complete: false },
      });
      setSelectedFile("");
      setcallName("");
      setemail("");
      location.reload();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <IoMdCloudUpload className="text-2xl" /> Upload Audio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Audio</DialogTitle>
        </DialogHeader>
        {!processSteps["Transcription"].active ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpload();
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Call Name
                </Label>
                <Input
                  value={callName}
                  onChange={(e) => {
                    setcallName(e.target.value);
                  }}
                  id="name"
                  placeholder="John Doe"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Email
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  placeholder="email@example.com"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setemail(e.target.value);
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  SOP
                </Label>
                <Textarea
                  placeholder="Enter comma-separated SOP steps"
                  className="col-span-3"
                  onChange={(e) => {
                    setSop(e.target.value);
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Upload
                </Label>
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Upload Audio</Button>
            </DialogFooter>
          </form>
        ) : (
          <ProcessingSteps processSteps={processSteps} />
        )}
      </DialogContent>
    </Dialog>
  );
}
