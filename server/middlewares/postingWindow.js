import SystemConfig from "../models/SystemConfig.js";

export const postingAllowed = async (req, res, next) => {
  try {
    let config = await SystemConfig.findOne();

    // create config if missing
    if (!config) {
      config = await SystemConfig.create({
        postingEnabled: true,
      });
    }

    // block posting for everyone except superadmin
    if (!config.postingEnabled && req.user.role !== "superadmin") {
      return res.status(403).json({
        message: "Note creation is currently disabled by admin",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
