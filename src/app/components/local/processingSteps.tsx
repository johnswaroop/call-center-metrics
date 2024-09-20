"use client";

import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import {
  FileAudio,
  FileText,
  Key,
  FileCheck,
  Check,
  LucideIcon,
} from "lucide-react";
import { IProcessSteps } from "@/actions/types";

interface Step {
  name: string;
  icon: LucideIcon;
}

const steps: Step[] = [
  { name: "Transcription", icon: FileAudio },
  { name: "Summary", icon: FileText },
  { name: "Keyword Analysis", icon: Key },
  { name: "SOP Processing", icon: FileCheck },
];

interface ProcessingStepProps {
  name: string;
  icon: LucideIcon;
  isActive: boolean;
  isCompleted: boolean;
}

const ProcessingStep: React.FC<ProcessingStepProps> = ({
  name,
  icon: Icon,
  isActive,
  isCompleted,
}) => (
  <div
    className={`flex items-center space-x-3 ${
      isActive
        ? "text-primary"
        : isCompleted
        ? "text-primary"
        : "text-muted-foreground"
    }`}
  >
    <div
      className={`rounded-full p-1 ${
        isCompleted ? "bg-primary" : isActive ? "bg-primary/20" : "bg-muted"
      }`}
    >
      {isCompleted ? (
        <Check className="h-4 w-4 text-primary-foreground" />
      ) : (
        <Icon
          className={`h-4 w-4 ${
            isActive ? "text-primary" : "text-muted-foreground"
          }`}
        />
      )}
    </div>
    <span
      className={`text-sm font-medium ${
        isCompleted || isActive ? "text-foreground" : ""
      }`}
    >
      {name}
    </span>
  </div>
);

function ProcessingSteps({ processSteps }: { processSteps: IProcessSteps }) {
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    setCurrentStep(
      Object.values(processSteps).filter((ele) => ele.complete).length
    );
  }, [processSteps]);

  return (
    <div className="py-4">
      <div className="space-y-5">
        {Object.keys(processSteps).map((step, index) => {
          const current = steps.find((el) => el.name == `${step}`);
          return (
            <ProcessingStep
              key={step + index}
              name={step}
              icon={current!.icon}
              isActive={processSteps[`${step}` as keyof IProcessSteps].active}
              isCompleted={
                processSteps[`${step}` as keyof IProcessSteps].complete
              }
            />
          );
        })}
      </div>
      <Progress value={(currentStep / steps.length) * 100} className="mt-6" />
    </div>
  );
}

export default ProcessingSteps;
