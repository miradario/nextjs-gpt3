// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
//dotenv
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prompt = req.query.prompt;
  const topic = req.query.topic;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt missing" });
  }

  if (prompt.length > 100) {
    return res.status(400).json({ error: "Prompt too long" });
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Answer as if you were Sri Sri Ravi Shankar.\n
    Prompt: ${prompt}\n
    Gurudev quote:`,
      max_tokens: 500,
      temperature: 1,
      presence_penalty: 0,
      frequency_penalty: 0,
    });
    const quote = completion.data.choices[0].text;

    res.status(200).json({ quote });

    /*  const quote = completion.data.choices[0].text;

    const img = await openai.createImage({
      prompt: "Digital art landscape with meditation love " + prompt,
      n: 2,
      size: "512x512",
    });

    const image_url = img.data.data[0].url;
    res.status(200).json({ quote, image_url }); 
    //error
    */
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: "Server error" });
  }
}
