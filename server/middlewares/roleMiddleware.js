import SystemConfig from "../models/SystemConfig.js";

/* ================= ROLE CHECK ================= */
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

/* ================= GROUP CHECK ================= */
export const requireGroup = (req, res, next) => {
  if (req.user.role === "superadmin") return next();

  if (!req.user.groupId) {
    return res.status(403).json({
      message: "User is not assigned to a group",
    });
  }

  next();
};

/* ================= POSTING WINDOW ================= */
export const postingAllowed = async (req, res, next) => {
  try {
    let config = await SystemConfig.findOne();

    if (!config) {
      config = await SystemConfig.create({ postingEnabled: true });
    }

    if (!config.postingEnabled && req.user.role !== "superadmin") {
      return res.status(403).json({
        message: "Make Public or Private Notes is currently disabled by Superadmin",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
