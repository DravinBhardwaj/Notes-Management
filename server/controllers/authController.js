import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ================= EMAIL REGEX ================= */
const emailRegex =
  /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail|icloud|college)\.(com|edu|in)$/;

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  try {
    let { name, email, password, groupId, groupMode } = req.body;

    if (!name || !email || !password || !groupId || !groupMode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    name = name.trim();
    email = email.trim().toLowerCase();
    groupId = groupId.trim().toLowerCase();

   const groupIdRegex = /^[a-z0-9][a-z0-9._-]{3,28}[a-z0-9]$/;

if (!groupIdRegex.test(groupId)) {
  return res.status(400).json({
    message:
      "Group ID must be 5–30 characters long. Use only lowercase letters (a–z), numbers (0–9), and these symbols: ., _, -. It must start and end with a letter or number.",
  });
}


    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Use a valid email like name@gmail.com",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    if (!["join", "create"].includes(groupMode)) {
      return res.status(400).json({
        message: "Invalid group mode",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const groupExists = await User.exists({ groupId });

    if (groupMode === "create" && groupExists) {
      return res.status(400).json({
        message: "Group ID already exists. Choose a different one.",
      });
    }

    if (groupMode === "join" && !groupExists) {
      return res.status(400).json({
        message: "Group does not exist. Create it first.",
      });
    }

    const isGroupAdmin = groupMode === "create";
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      isGroupAdmin,
      groupId,
    });

    res.status(201).json({
      message:
        groupMode === "create"
          ? "Group created successfully. You are the group admin."
          : "Joined group successfully.",
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};


/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      groupId: user.groupId,
      isGroupAdmin: user.isGroupAdmin,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};


/* ================= GET ME ================= */
export const getMe = async (req, res) => {
  res.json(req.user);
};

/* ================= LOGOUT ================= */
export const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.json({ message: "Logged out successfully" });
};

