import User from "../models/User.js";

export const checkSuperAdminContactLimit = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      user.lastSuperAdminContact &&
      user.lastSuperAdminContact >= today
    ) {
      return res.status(429).json({
        message: "You can send only one request per day",
      });
    }

    user.lastSuperAdminContact = new Date();
    await user.save();

    res.status(200).json({ allowed: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
