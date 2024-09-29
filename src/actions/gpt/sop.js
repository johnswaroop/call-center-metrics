"use server";
import OpenAI from "openai";
import action_updateCallDetails from "../updateCallDetails";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

function generatePrompt(stepsString) {
    const stepsArray = stepsString.split(',').map((step, index) => {
        return { step: index + 1, action: step.trim() };
    });

    const sopJson = {
        sop: stepsArray
    };

    const prompt = `
  Compare the following conversation to the provided SOP and check if each step was followed. Output a JSON with each step, whether it was followed, present in the conversation in someway (true or false), and any relevant comments.
  
  **SOP:**
  
  ${JSON.stringify(sopJson, null, 2)}
  
  **Output Format:**
  
  {
    "sop": [
      { "step": 1, "action": "Greet the customer and introduce yourself.", "followed": true, "comments": "The agent greeted the customer." },
      { "step": 2, "action": "Ask for the number of guests.", "followed": true, "comments": "The agent asked for guest count." }
      // Repeat for all steps.
    ]
  }
  `;

    return prompt;
}


const sopSchema = z.object({
    sop: z.array(
        z.object({
            step: z.number().int(),
            action: z.string(),
            followed: z.boolean(),
            comments: z.string()
        })
    ),
});




const openai = new OpenAI({
    apiKey: `${process.env.OPENAI_API_KEY}`,
});

export default async function action_sop(callId, conversation, sop) {


    let PROMPT = generatePrompt(sop)

    const messages = [
        { role: "user", content: `**Conversation:** ${conversation}` },
    ]

    const prePrompt = [
        {
            role: "system",
            content: PROMPT,
        },
        ...messages,
    ];

    const options = {
        model: "gpt-4o-mini",
        max_tokens: 1500,
        messages: prePrompt,
        response_format: zodResponseFormat(sopSchema, "sop_schema"),
    }

    const response = await openai.chat.completions.create(options);
    const parsedData = JSON.parse(response.choices[0].message.content);

    if (parsedData) {
        console.log(parsedData)
        await action_updateCallDetails(callId, { sopSteps: parsedData.sop })
        return parsedData
    }
    console.log("failed")
    return {}
}

