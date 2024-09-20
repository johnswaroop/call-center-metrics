"use server";
import OpenAI from "openai";
import action_updateCallDetails from "../updateCallDetails";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

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

let PROMPT = `
Compare the following conversation to the provided SOP and check if each step was followed. Output a JSON with each step, whether it was followed true or false, and any relevant comments.

**SOP:**

{
  "sop": [
    { "step": 1, "action": "Greet the customer and introduce yourself." },
    { "step": 2, "action": "Ask for the number of guests." },
    { "step": 3, "action": "Confirm if they need single or multiple rooms." },
    { "step": 4, "action": "Inquire about specific requirements (Wi-Fi, pool, etc.)." },
    { "step": 5, "action": "Ask for the dates of stay." },
    { "step": 6, "action": "Recommend suitable room options with price and amenities." },
    { "step": 7, "action": "Offer alternative, more affordable options if necessary." },
    { "step": 8, "action": "Confirm if meals are required (breakfast, lunch, or dinner)." },
    { "step": 9, "action": "Recap room type, number of rooms, total price, and amenities included." },
    { "step": 10, "action": "Ask for the customer's email address for booking confirmation." },
    { "step": 11, "action": "Inform the customer about the secure payment process." },
    { "step": 12, "action": "Remind them not to share card details over the phone." },
    { "step": 13, "action": "Reiterate the hotel's official email for secure payments." },
    { "step": 14, "action": "Ask if the customer needs anything else before ending the call." },
    { "step": 15, "action": "Thank the customer and wish them a great day." }
  ]
}

**Output Format:**

{
  "sop": [
    { "step": 1, "action": "Greet the customer and introduce yourself.", "followed": true, "comments": "The agent greeted the customer." },
    { "step": 2, "action": "Ask for the number of guests.", "followed": true, "comments": "The agent asked for guest count." }
    // Repeat for all steps.
  ]
}
`


const openai = new OpenAI({
    apiKey: `${process.env.OPENAI_API_KEY}`,
});

export default async function action_sop(callId, conversation) {

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

