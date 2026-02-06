import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

import {
  getAllUsers,
  getAdminStats,
  deleteUser,
  togglePostingWindow,
  getSystemStatus,
  toggleGroupAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

/* ================= DASHBOARD STATS ================= */
router.get(
  "/stats",
  authMiddleware,
  allowRoles("superadmin"),
  getAdminStats
);

/* ================= GET ALL USERS ================= */
router.get(
  "/users",
  authMiddleware,
  allowRoles("superadmin"),
  getAllUsers
);

/* ================= TOGGLE GROUP ADMIN ================= */
/*
  superadmin only
  toggles isGroupAdmin true/false
*/
router.put(
  "/users/:id/group-admin",
  authMiddleware,
  allowRoles("superadmin"),
  toggleGroupAdmin
);

/* ================= DELETE USER ================= */
router.delete(
  "/users/:id",
  authMiddleware,
  allowRoles("superadmin"),
  deleteUser
);

/* ================= POSTING WINDOW ================= */
router.post(
  "/posting-toggle",
  authMiddleware,
  allowRoles("superadmin"),
  togglePostingWindow
);

/* ================= SYSTEM STATUS ================= */
router.get(
  "/system-status",
  authMiddleware,
  allowRoles("superadmin"),
  getSystemStatus
);

export default router;
