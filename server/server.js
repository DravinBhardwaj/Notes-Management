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

/* ---------- CORS SETUP ---------- */
const allowedOrigins = [
  process.env.CLIENT_URL,          // production frontend
  "http://localhost:5173",          // local dev
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server, Postman, health checks
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  })
);


/* ---------- MIDDLEWARES ---------- */
app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());

/* ---------- HEALTH / PING ---------- */
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/ping", (req, res) => {
  res.status(200).json({ status: "ok" });
});

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/group", groupRoutes);

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
