import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
  generateSummary,
  generateQuestions,
  deleteSummary,
  deleteQuestions,
  askQuestion,
} from "../controllers/aiController.js";

import {
  chatWithPdf,
  getChatHistory,
  clearChat,
} from "../controllers/chatController.js";

const router = express.Router();

/* ================= SUMMARY ================= */

router.post(
  "/:noteId/summary",
  authMiddleware,
  generateSummary
);

/* ================= QUESTIONS ================= */

router.post(
  "/:noteId/questions",
  authMiddleware,
  generateQuestions
);

/* ================= ASK PDF (OLD SINGLE QUESTION) ================= */

router.post(
  "/:noteId/ask",
  authMiddleware,
  askQuestion
);

/* ================= CHAT PDF ================= */

router.post(
  "/:noteId/chat",
  authMiddleware,
  chatWithPdf
);

router.get(
  "/:noteId/chat",
  authMiddleware,
  getChatHistory
);

router.delete(
  "/:noteId/chat",
  authMiddleware,
  clearChat
);

/* ================= DELETE SUMMARY ================= */

router.delete(
  "/:noteId/summary",
  authMiddleware,
  deleteSummary
);

/* ================= DELETE QUESTIONS ================= */

router.delete(
  "/:noteId/questions",
  authMiddleware,
  deleteQuestions
);

export default router;