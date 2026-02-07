import User from "../models/User.js";

export const checkSuperAdminContactLimit = async (req, res) => {
  try {
    const userId = req.user.id;

    // Start of today (server time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🔒 ATOMIC check + update (CORRECT)
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        $or: [
          { lastSuperAdminContact: null },       // ✅ NEW USER
          { lastSuperAdminContact: { $lt: today } }, // ✅ OLD USER (previous day)
        ],
      },
      { lastSuperAdminContact: new Date() },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(429).json({
        message: "You can send only one request per day",
      });
    }

    res.status(200).json({ allowed: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
