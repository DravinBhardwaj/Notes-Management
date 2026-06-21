import Chat from "../models/Chat.js";
import Note from "../models/Note.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { searchChunks } from "../utils/VectorSearch.js";

export const chatWithPdf = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    let chat = await Chat.findOne({
      noteId,
      userId: req.userId,
    });

    if (!chat) {
      chat = await Chat.create({
        noteId,
        userId: req.userId,
        messages: [],
      });
    }

    const chunks = await searchChunks(
      noteId,
      message,
      5
    );
    if (!chunks.length) {
      return res.status(404).json({
        success: false,
        message: "No relevant content found",
      });
    }
    const context = chunks
      .map((chunk) => chunk.text)
      .join("\n\n");

    const previousMessages =
      chat.messages.slice(-10);

    const history = previousMessages
      .map(
        (msg) =>
          `${msg.role}: ${msg.content}`
      )
      .join("\n");

    const llm =
      new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        apiKey:
          process.env.GOOGLE_API_KEY,
      });

    const result =
      await llm.invoke(`
You are a helpful PDF study assistant.

Answer ONLY using:

1. Previous conversation
2. Retrieved document context

If the answer is not found in the document, reply:
"I could not find this information in the document."

Chat History:
${history}

Document Context:
${context}

Current Question:
${message}

Answer:
`);

    chat.messages.push({
      role: "user",
      content: message,
    });

    chat.messages.push({
      role: "assistant",
      content: result.content,
    });

    if (chat.messages.length > 100) {
      chat.messages =
        chat.messages.slice(-100);
    }
    await chat.save();

    res.status(200).json({
      success: true,
      answer: result.content,
      sources: chunks.map((c) => ({
        pageNumber: c.pageNumber,
        score: c.score,
      })),
    });
  } catch (error) {
    console.error(
      "CHAT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getChatHistory = async (
  req,
  res
) => {
  try {
    const { noteId } = req.params;

    const chat =
      await Chat.findOne({
        noteId,
        userId: req.userId,
      });

    res.status(200).json({
      success: true,
      messages:
        chat?.messages || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const clearChat = async (
  req,
  res
) => {
  try {
    const { noteId } = req.params;

    await Chat.findOneAndDelete({
      noteId,
      userId: req.userId,
    });

    res.status(200).json({
      success: true,
      message:
        "Chat cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};