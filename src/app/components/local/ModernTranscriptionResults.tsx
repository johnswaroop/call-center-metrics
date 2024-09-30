"use client";
import { useEffect, useState } from "react";
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
import Translate from "@/utils/translate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import languageList from "../../../utils/languageList.json";

type supportedLanguages = keyof typeof languageList;

interface IResult extends ICall {}

export function ModernTranscriptionResults(props: IResult) {
  const [result, setresult] = useState<IResult>(props);
  const [isTranscriptionExpanded, setIsTranscriptionExpanded] = useState(false);
  const [selectedLanguage, setselectedLanguage] =
    useState<supportedLanguages>("English");
  const [loadingTranslation, setloadingTranslation] = useState(true);
  const {
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
  } = result;

  useEffect(() => {
    setloadingTranslation(true);
    if (selectedLanguage == "English") {
      setresult(props);
      setloadingTranslation(false);
    } else {
      Translate(props, languageList[`${selectedLanguage}`]).then((date) => {
        setresult({ ...date, sentiment: props.sentiment });
        setloadingTranslation(false);
      });
    }
  }, [selectedLanguage]);

  console.log({ selectedLanguage });

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

  return (
    <>
      <div className="container mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
        <Nav />

        <Card className="shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex justify-between items-center text-lg font-medium">
              <span>Transcription</span>
              <Select
                value={selectedLanguage}
                onValueChange={(value) => {
                  setselectedLanguage(value as supportedLanguages);
                }}
              >
                <SelectTrigger className="w-[180px] ml-auto mr-4">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(languageList).map((ll) => {
                    return (
                      <SelectItem key={ll + "lang"} value={ll}>
                        {ll}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
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
              <CardTitle className="text-lg font-medium">
                Caller Query
              </CardTitle>
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
              <CardTitle className="text-lg font-medium">
                Expert Answer
              </CardTitle>
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
              <CardTitle className="text-lg font-medium">
                Key Insights
              </CardTitle>
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
              <div className="flex gap-2 items-center">
                <div
                  className={`w-4 h-4 rounded-full  ${
                    sentimentColor[`${overallSentiment}` as keyof TSentiment]
                  }`}
                ></div>
                <span className="capitalize text-sm text-gray-600 ">
                  {overallSentiment}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2 w-fit">
                {justification}
              </p>
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
      {loadingTranslation && (
        <div className=" w-full h-screen fixed top-0 bg-[#ffffff74] flex justify-center items-center backdrop-blur-sm">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
}
