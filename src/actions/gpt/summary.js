"use server";
import OpenAI from "openai";
import action_updateCallDetails from "../updateCallDetails";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const conversationExtraction = z.object({
  summary: z.string(),
  query: z.string(),
  response: z.string(),
  questions: z.array(z.string())
});


const openai = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
});

export default async function action_summary(callId, conversation) {
  const messages = [
    {
      role: "user",
      content:
        "#output format is JSON only format which is {summary : , query: ,response: } ",
    },
    { role: "user", content: conversation },
  ]

  const prePrompt = [
    {
      role: "system",
      content: "you are a intelligent transcription service and assistant, the answer should contain summary of the conversation in under 200 words , query: synopsis of the query or question asked by the caller , response :synopsis of the answer or response given in the  conversation by the team, questions : rephrase the questions asked by the caller only. Do not include any agent questions here, group similar questions together , give answers into the given structure.",
    },
    ...messages,
  ];

  const options = {
    model: "gpt-4o-mini",
    max_tokens: 1500,
    messages: prePrompt,
    response_format: zodResponseFormat(conversationExtraction, "conversation_extraction"),
  }
  const response = await openai.chat.completions.create(options);
  const parsedData = JSON.parse(response.choices[0].message.content);

  if (parsedData) {
    console.log(parsedData)
    await action_updateCallDetails(callId, { summary: parsedData.summary, userQuery: parsedData.query, agentAnswer: parsedData.response, questions: parsedData.questions })
    return parsedData
  }
  console.log("failed")
  return {}
}

