import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { requireGroup, postingAllowed } from "../middlewares/roleMiddleware.js";
import upload from "../utils/multer.js";

import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  uploadPdfController,
  deleteNote,
  downloadNotePdf,
} from "../controllers/noteController.js";

const router = express.Router();

// ✅ CREATE NOTE (NO postingAllowed here)
router.post("/", authMiddleware, requireGroup, createNote);

// READ
router.get("/", authMiddleware, requireGroup, getNotes);
router.get("/:id", authMiddleware, requireGroup, getNoteById);

// 🔒 UPDATE NOTE (visibility can change → keep postingAllowed)
router.put("/:id", authMiddleware, requireGroup, postingAllowed, updateNote);

// UPLOAD PDF (always private)
router.post(
  "/upload",
  authMiddleware,
  requireGroup,
  upload.single("pdf"),
  uploadPdfController
);

// DELETE
router.delete("/:id", authMiddleware, requireGroup, deleteNote);

// DOWNLOAD PDF (always allowed)
router.get("/:id/download", authMiddleware, requireGroup, downloadNotePdf);

export default router;
