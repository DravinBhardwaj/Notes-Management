import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAIEmbeddings }
from "@langchain/google-genai";

const embeddings =
  new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-embedding-2",
  });

const vector =
  await embeddings.embedQuery(
    "Hello World"
  );

console.log(vector.length);