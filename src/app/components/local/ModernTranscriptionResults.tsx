"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Info,
  CircleHelp,
} from "lucide-react";
import { ICall } from "@/models/call";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "./nav";

interface IResult extends ICall {}

export function ModernTranscriptionResults({
  transcript: transcription,
  userQuery,
  agentAnswer,
  keywords: frequentKeywords,
  sopSteps: completedSOPSteps,
  sentiment: overallSentiment,
  talkToListenRatio,
  keyInsights,
  questions,
  justification,
}: IResult) {
  const [isTranscriptionExpanded, setIsTranscriptionExpanded] = useState(false);

  const sentimentColor = {
    positive: "bg-green-400",
    neutral: "bg-yellow-400",
    negative: "bg-red-400",
  };

  type TSentiment = typeof sentimentColor;

  const sopCompleted = completedSOPSteps?.filter((el) => el.followed);
  const sopMisssed = completedSOPSteps?.filter((el) => !el.followed);
  const sopAdherenceScore =
    (sopCompleted!.length / completedSOPSteps!.length) * 100;

  console.log(sopAdherenceScore);

  console.log({ keyInsights });

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      <Nav />

      <Card className="shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex justify-between items-center text-lg font-medium">
            <span>Transcription</span>
            <button
              onClick={() =>
                setIsTranscriptionExpanded(!isTranscriptionExpanded)
              }
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={
                isTranscriptionExpanded
                  ? "Collapse transcription"
                  : "Expand transcription"
              }
            >
              {isTranscriptionExpanded ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <AnimatePresence>
            {isTranscriptionExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="text-gray-600 text-sm leading-relaxed">
                  {transcription}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {!isTranscriptionExpanded && (
            <p className="text-gray-600 text-sm truncate">{transcription}</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-medium">Caller Query</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-gray-600 text-sm">{userQuery}</p>
            <ul className="space-y-2 mt-4">
              {questions!.map((step, index) => (
                <li key={index} className="flex items-center">
                  <CircleHelp
                    className="text-yellow-400 mr-2 flex-shrink-0"
                    size={14}
                  />
                  <span className="text-gray-600 text-sm">{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-medium">Expert Answer</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-gray-600 text-sm">{agentAnswer}</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm md:grid-cols-2">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-medium">
              Frequently Mentioned Keywords
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-2">
              {frequentKeywords.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs font-normal bg-gray-100 text-gray-600"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm md:grid-cols-2">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-medium">Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2">
              {keyInsights!.map((step, index) => (
                <li key={index} className="flex items-center">
                  <Info
                    className="text-blue-400 mr-2 flex-shrink-0"
                    size={14}
                  />
                  <span className="text-gray-600 text-sm">{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-lg font-medium">
            Adherence to SOP
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Progress value={sopAdherenceScore} className="w-full h-2" />
          <p className="mt-2 text-right text-sm text-gray-600">
            {sopAdherenceScore}%
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-medium">
              Missed SOP Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2">
              {sopMisssed!.map((step, index) => (
                <li key={index} className="flex items-center">
                  <XCircle
                    className="text-red-400 mr-2 flex-shrink-0"
                    size={14}
                  />
                  <span className="text-gray-600 text-sm">{step.action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-medium">
              Completed SOP Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2">
              {sopCompleted!.map((step, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle
                    className="text-green-400 mr-2 flex-shrink-0"
                    size={14}
                  />
                  <span className="text-gray-600 text-sm">{step.action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-medium">
              Overall Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col  space-x-4">
            <div className="flex gap-1">
              <div
                className={`w-4 h-4 rounded-full  ${
                  sentimentColor[`${overallSentiment}` as keyof TSentiment]
                }`}
              ></div>
              <span className="capitalize text-sm text-gray-600">
                {overallSentiment}
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-2 w-full">{justification}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-medium">
              Talk-to-Listen Ratio
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 bg-blue-400 rounded-full"
                  style={{ width: `${talkToListenRatio * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">
                {talkToListenRatio.toFixed(2)}
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Agent spoke {(talkToListenRatio * 100).toFixed(0)}% of the time
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
