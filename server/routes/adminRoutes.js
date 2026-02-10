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

router.get("/stats", authMiddleware, allowRoles("superadmin"), getAdminStats);
router.get("/users", authMiddleware, allowRoles("superadmin"), getAllUsers);
router.put(
  "/users/:id/group-admin",
  authMiddleware,
  allowRoles("superadmin"),
  toggleGroupAdmin
);
router.delete(
  "/users/:id",
  authMiddleware,
  allowRoles("superadmin"),
  deleteUser
);
router.post(
  "/posting-toggle",
  authMiddleware,
  allowRoles("superadmin"),
  togglePostingWindow
);
router.get(
  "/system-status",
  authMiddleware,
  allowRoles("superadmin"),
  getSystemStatus
);

export default router;
