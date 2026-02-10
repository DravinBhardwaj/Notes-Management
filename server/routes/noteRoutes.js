import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  requireGroup,
  postingAllowed,
} from "../middlewares/roleMiddleware.js";

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

router.post("/", authMiddleware, requireGroup, postingAllowed, createNote);
router.get("/", authMiddleware, requireGroup, getNotes);
router.get("/:id", authMiddleware, requireGroup, getNoteById);
router.put("/:id", authMiddleware, requireGroup, postingAllowed, updateNote);
router.post(
  "/upload",
  authMiddleware,
  requireGroup,
  upload.single("pdf"),
  uploadPdfController
);
router.delete("/:id", authMiddleware, requireGroup, deleteNote);
router.get("/:id/download", authMiddleware, requireGroup, downloadNotePdf);

export default router;
