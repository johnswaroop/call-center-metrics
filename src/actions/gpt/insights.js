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
  ]
}

`

export default async function action_insights(callId = "66ed6ecb6dfbb0a3078afef4", conversation = "Hi, thank you for calling Hotel California, this is Candice, how may I help you? Hi Candice, this is Steven. I'd like to book for 4 people please, and that would be for August 18th. Sure Steven, I'd be happy to help you with that. So, which room do you have in mind? Actually, I gotta tell you first that I am super busy, so I haven't been able to browse through your website, and I don't know, I don't really know the rooms you have right now, but I could give you my requirements, and then you suggest the best rooms for me. Could we do that? Absolutely, what do you need? So, there are 4 of us, including me, and we need something with Wi-Fi, and maybe a swimming pool. Got it. Will you 4 be staying in one room, or separate rooms? Oh, sorry, I forgot to tell you. That would be separate, because you see we're 2 couples, so we need 2 rooms. I see. So, in that case, I recommend 2 deluxe kings. Each room has a king size bed, which fits 2 people, a Wi-Fi, and access to a swimming pool, and free lunch and breakfast. All of these for $200 each, and that's gonna be $400 for 2 rooms. How does it sound? Oh, that is a bit too much. That's a bit expensive. Actually, do you maybe have something more affordable than that? It's just that now that I think about it, I remember there's a beach close to your hotel, so we will probably just take a trip there, and you can take out the swimming pool. Is that possible? Sure. Let me see your options here. So, if you want to take out the swimming pool and just have the Wi-Fi, then we certainly have a room for that, and that is the classic king for $125 each, which is $250 for 2 rooms, as opposed to $400. And you're still gonna get the king size bed and the Wi-Fi, but I have to tell you, Stephen, aside from having no swimming pool, you will also only get a free breakfast, instead of lunch and breakfast. Is that okay with you? Perfect. Perfect, Candice. That's exactly what we need. We'll be having lunch at the beach anyway, so we won't be eating at the hotel. So, 2 classic king it is. Do you need my credit card number, or what do you need? For security purposes, we don't really take credit card info over the phone, but what I need from you instead is your email address, where I can send you a link, where you can securely pay and enter your card information. Okay, cool. You can send it to stephen__182 at gmail.com. Thank you. How do you spell Stephen, by the way? Is that a Stephen with a V, or a Stephen with a P? That's with a P for Pepper. Thank you. So, just to make sure, let me just spell that out for you. That is S for Sierra, T for Tango, E for Echo, P for Peter, H for Hotel, and for Nancy, underscore 182 at gmail.com. Yep, that's correct. Okay, perfect. So, just to recap, you will be booking 2 classic kings this August 18th, 2020. And the total amount is $250 for 2 rooms. Are all of these correct? Yep, all correct. Thank you, Stephen. So, after this call, you should receive an email from booking at calihotel.com. And that email is a secure link, where you can click and enter your full name and card info. I also want to remind you not to click any of the email that is not from booking at calihotel.com, because we only take payments through this one email. Alright? Gotcha. So, is there anything else that I can help you with today? Nope. You've been very helpful, Candice. Thank you so much. You're most welcome, Stephen. Thank you for calling Hotel California. You have a great day. Have a great day, Candice. Bye.") {


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

