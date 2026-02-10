// dotenv MUST be first
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/connectDB.js";

import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";

// Connect DB
connectDB();

const app = express();

/* =========================================================
   🔥 VERY IMPORTANT (REQUIRED FOR RENDER + COOKIES)
   ========================================================= */
app.set("trust proxy", 1);

/* =========================================================
   CORS CONFIG (SIMPLIFIED & CORRECT)
   ========================================================= */
app.use(
  cors({
    origin: process.env.CLIENT_URL, // e.g. https://notes-management-2flb.vercel.app
    credentials: true,
  })
);

/* =========================================================
   MIDDLEWARES
   ========================================================= */
app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());

/* =========================================================
   HEALTH / PING
   ========================================================= */
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/ping", (req, res) => {
  res.status(200).json({ status: "ok" });
});

/* =========================================================
   ROUTES
   ========================================================= */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/group", groupRoutes);

/* =========================================================
   SERVER
   ========================================================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
