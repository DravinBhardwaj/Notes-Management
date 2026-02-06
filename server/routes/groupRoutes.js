import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getGroupMembers,
  toggleGroupAdmin,
} from "../controllers/groupController.js";

const router = express.Router();

/* ================= GROUP MEMBERS ================= */
router.get("/members", authMiddleware, getGroupMembers);

/* ================= TOGGLE ADMIN ================= */
router.put(
  "/members/:id/toggle-admin",
  authMiddleware,
  toggleGroupAdmin
);

export default router;
