import Note from "../models/Note.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import PdfChunk from "../models/PdfChunk.js";
import { searchChunks } from "../utils/vectorSearch.js";
/* ================= CLEAN HTML ================= */

const cleanHtml = (html = "") => {
    return html
        .replace(/&nbsp;/gi, " ")
        .replace(/<div><br><\/div>/gi, "\n")
        .replace(/<div>/gi, "\n")
        .replace(/<\/div>/gi, "")
        .replace(/<p>/gi, "\n")
        .replace(/<\/p>/gi, "")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
};

/* ================= SUMMARY ================= */

export const generateSummary = async (req, res) => {
    try {
        const { noteId } = req.params;

        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        const chunks = await PdfChunk.find({
            noteId,
        }).sort({ chunkIndex: 1 });

        if (!chunks.length) {
            return res.status(404).json({
                success: false,
                message: "No chunks found",
            });
        }

        const text = chunks
            .map((chunk) => chunk.text)
            .join("\n\n")
            .slice(0, 20000);

        const llm = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash",
            apiKey: process.env.GOOGLE_API_KEY,
        });

        const result = await llm.invoke(`
Create a concise study summary.

Rules:
- Use headings where needed.
- Use bullet points for important points.
- Highlight important terms using bold text.
- Keep the summary concise and easy to revise.
- Do not include unnecessary explanations.

Content:
${text}
`);

        note.summary = result.content;

        await note.save();

        res.status(200).json({
            success: true,
            summary: note.summary,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ================= QUESTIONS ================= */

export const generateQuestions = async (req, res) => {
    try {
        const { noteId } = req.params;

        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        if (note.questions?.length > 0) {
            return res.status(200).json({
                success: true,
                questions: note.questions,
            });
        }

        const chunks = await PdfChunk.find({
            noteId,
        }).sort({ chunkIndex: 1 });

        if (!chunks.length) {
            return res.status(404).json({
                success: false,
                message: "No chunks found",
            });
        }

        const text = chunks
            .map((chunk) => chunk.text)
            .join("\n\n")
            .slice(0, 20000);

        const llm = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash",
            apiKey: process.env.GOOGLE_API_KEY,
        });

        const result = await llm.invoke(`
You are an exam paper setter.

Generate exactly 10 important questions.

Rules:
- Questions should be short and easy to understand
- Focus on concepts, definitions and explanations
- No answers
- One question per line
Content:
${text}
`);

        const questionsArray = result.content
            .split("\n")
            .map((q) =>
                q.replace(/^\d+[\).\-\s]*/, "").trim()
            )
            .filter(Boolean);

        note.questions = questionsArray;

        await note.save();

        res.status(200).json({
            success: true,
            questions: questionsArray,
        });
    } catch (error) {
        console.error("QUESTION ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ================= ASK PDF ================= */

export const askQuestion = async (
    req,
    res
) => {
    try {
        const { noteId } = req.params;
        const { question } = req.body;

        if (!question?.trim()) {
            return res.status(400).json({
                success: false,
                message:
                    "Question is required",
            });
        }

        const note =
            await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({
                success: false,
                message:
                    "Note not found",
            });
        }

        const chunks =
            await searchChunks(
                noteId,
                question,
                5
            );

        if (!chunks.length) {
            return res.status(404).json({
                success: false,
                message:
                    "No relevant content found",
            });
        }

        const context = chunks
            .map((chunk) => chunk.text)
            .join("\n\n");

        const llm =
            new ChatGoogleGenerativeAI({
                model:
                    "gemini-2.5-flash",
                apiKey:
                    process.env
                        .GOOGLE_API_KEY,
            });

        const result =
            await llm.invoke(`
You are a helpful study assistant.

Use ONLY the provided context.

If the answer is not present in the context, reply:
"I could not find this information in the document."

Context:
${context}

Question:
${question}

Answer:
`);

        res.status(200).json({
            success: true,
            answer: result.content,
            sources: chunks.map(
                (chunk) => ({
                    pageNumber:
                        chunk.pageNumber,
                    score: chunk.score,
                })
            ),
        });
    } catch (error) {
        console.error(
            "ASK QUESTION ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
/* ================= DELETE SUMMARY ================= */

export const deleteSummary = async (req, res) => {
    try {
        const { noteId } = req.params;

        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        note.summary = "";

        await note.save();

        res.status(200).json({
            success: true,
            message: "Summary deleted successfully",
        });
    } catch (error) {
        console.error("DELETE SUMMARY ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
/* ================= DELETE QUESTIONS ================= */

export const deleteQuestions = async (req, res) => {
    try {
        const { noteId } = req.params;

        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        note.questions = [];

        await note.save();

        res.status(200).json({
            success: true,
            message: "Questions deleted successfully",
        });
    } catch (error) {
        console.error("DELETE QUESTIONS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};