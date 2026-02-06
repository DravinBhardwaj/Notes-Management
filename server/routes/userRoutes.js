import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/**
  GET ALL USERS (SUPER ADMIN ONLY) */
 
router.get(
  "/",
  authMiddleware,
  allowRoles("superadmin"),
  async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
