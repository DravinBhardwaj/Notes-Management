import { GoogleGenerativeAIEmbeddings }
from "@langchain/google-genai";

export const generateEmbedding = async (
  text
) => {
  try {
    if (!text?.trim()) {
      return [];
    }

    const embeddings =
      new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        model: "gemini-embedding-2",
      });

    return await embeddings.embedQuery(
      text.trim()
    );
  } catch (error) {
    console.error(
      "Embedding Error:",
      error.message
    );

    return [];
  }
};