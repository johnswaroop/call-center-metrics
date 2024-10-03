"use server";
import OpenAI from "openai";
import action_updateCallDetails from "../updateCallDetails";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const supportCallSchema = z.object({
    keywords: z.array(z.string()),
    talk_to_listen_ratio: z.number(),
    sentiment: z.enum(["positive", "neutral", "negative"]),
    key_insights: z.array(z.string())
});


const openai = new OpenAI({
    apiKey: `${process.env.OPENAI_API_KEY}`,
});

const PROMPT = `
"Given the transcription of a support call, extract and return the following in JSON format:

1. **Keywords**: List of key terms.
2. **Talk-to-Listen Ratio**: Ratio of agent to customer talk time as a decimal.
3. **Sentiment**: Overall sentiment as positive, neutral, or negative.
4. **Key Insights**: Extract key business and industry insights, including relevant data points, challenges, opportunities, trends, and other business-related observation and rewite it in breif.

Output structure:

{
  "keywords": ["keyword1", "keyword2", ...],
  "talk_to_listen_ratio": X.XX,
  "sentiment": "positive/neutral/negative",
  "key_insights": [
    "Insight 1",
    "Insight 2",
    "Insight 3",
    "Insight n",
  ]
}

`

export default async function action_insights(callId, conversation) {


    const messages = [
        { role: "user", content: conversation },
    ]

    const prePrompt = [
        {
            role: "system",
            content: PROMPT
        },
        ...messages,
    ];



    const options = {
        model: "gpt-4o-mini",
        max_tokens: 1500,
        messages: prePrompt,
        response_format: zodResponseFormat(supportCallSchema, "support_call_schema"),
    }
    const response = await openai.chat.completions.create(options);
    const parsedData = JSON.parse(response.choices[0].message.content);

    if (parsedData) {
        console.log(parsedData)
        await action_updateCallDetails(callId, { keyInsights: parsedData.key_insights, keywords: parsedData.keywords, talkToListenRatio: parsedData.talk_to_listen_ratio, sentiment: parsedData.sentiment })
        return parsedData
    }
    console.log("failed")
    return {}
}

