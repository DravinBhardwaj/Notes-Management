import User from "../models/User.js";
import SystemConfig from "../models/SystemConfig.js";
import Note from "../models/Note.js";

/* ================= GET ALL USERS ================= */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $ne: "superadmin" },
    }).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADMIN DASHBOARD STATS ================= */
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalGroupAdmins = await User.countDocuments({
      isGroupAdmin: true,
    });

    const totalSuperAdmins = await User.countDocuments({
      role: "superadmin",
    });

    //  students = everyone except admins & superadmin
    const totalStudents =
      totalUsers - totalGroupAdmins - totalSuperAdmins;

    const totalNotes = await Note.countDocuments();
    const publicNotes = await Note.countDocuments({ visibility: "public" });
    const privateNotes = await Note.countDocuments({ visibility: "private" });

    res.json({
      totalUsers,
      totalGroupAdmins,
      totalStudents,
      totalNotes,
      publicNotes,
      privateNotes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= DELETE USER ================= */
export const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.userId.toString()) {
      return res.status(403).json({
        message: "You cannot delete yourself",
      });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= TOGGLE GROUP ADMIN ================= */
export const toggleGroupAdmin = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "superadmin") {
      return res.status(400).json({
        message: "Cannot modify superadmin",
      });
    }

    user.isGroupAdmin = !user.isGroupAdmin;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      groupId: user.groupId,
      isGroupAdmin: user.isGroupAdmin,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= TOGGLE POSTING WINDOW ================= */
export const togglePostingWindow = async (req, res) => {
  try {
    let config = await SystemConfig.findOne();

    if (!config) {
      config = await SystemConfig.create({ postingEnabled: true });
    }

    config.postingEnabled = !config.postingEnabled;
    await config.save();

    res.json({ postingEnabled: config.postingEnabled });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET SYSTEM STATUS ================= */
export const getSystemStatus = async (req, res) => {
  try {
    let config = await SystemConfig.findOne();

    if (!config) {
      config = await SystemConfig.create({ postingEnabled: true });
    }

    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
