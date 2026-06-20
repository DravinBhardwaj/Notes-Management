import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(
      process.env.GOOGLE_API_KEY
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(
      "Say hello"
    );

    console.log(result.response.text());
  } catch (error) {
    console.error(error);
  }
}

testGemini();