import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../utils/multer.js";
import { deleteNote } from "../controllers/noteController.js";
import { downloadNotePdf } from "../controllers/noteController.js";

import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  uploadPdfController,
} from "../controllers/noteController.js";

const router = express.Router();

/* CREATE NOTE */
router.post("/", authMiddleware, createNote);

/* GET ALL NOTES */
router.get("/", authMiddleware, getNotes);

/*  GET SINGLE NOTE (FOR EDIT) */
router.get("/:id", authMiddleware, getNoteById);

/*  UPDATE NOTE + REGENERATE PDF */
router.put("/:id", authMiddleware, updateNote);

/* UPLOAD PDF */
router.post(
  "/upload",
  authMiddleware,
  upload.single("pdf"),
  uploadPdfController
);
router.delete("/:id", authMiddleware, deleteNote);

router.get("/:id/download", authMiddleware, downloadNotePdf);

export default router;
