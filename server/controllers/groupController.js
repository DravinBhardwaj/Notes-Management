import User from "../models/User.js";

/* ================= GET GROUP MEMBERS ================= */
export const getGroupMembers = async (req, res) => {
  try {
    const { groupId, role } = req.user;

    // Superadmin does not belong to groups
    if (role === "superadmin") {
      return res.json([]);
    }

    if (!groupId) {
      return res.status(400).json({
        message: "User does not belong to any group",
      });
    }

    const members = await User.find({ groupId }).select(
      "name email isGroupAdmin"
    );

    res.json(members);
  } catch (err) {
    console.error("GET GROUP MEMBERS ERROR:", err);
    res.status(500).json({
      message: "Failed to load group members",
    });
  }
};

/* ================= TOGGLE GROUP ADMIN ================= */
export const toggleGroupAdmin = async (req, res) => {
  try {
    const currentUser = req.user;
    const targetUserId = req.params.id;

    //  ONLY GROUP ADMIN CAN CHANGE ROLES
    if (!currentUser.isGroupAdmin) {
      return res.status(403).json({
        message: "Only group admins can change roles",
      });
    }

    //  CANNOT CHANGE YOURSELF
    if (currentUser._id.toString() === targetUserId) {
      return res.status(400).json({
        message: "You cannot change your own role",
      });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    //  MUST BE SAME GROUP
    if (targetUser.groupId !== currentUser.groupId) {
      return res.status(403).json({
        message: "User belongs to a different group",
      });
    }

    //  PREVENT REMOVING LAST ADMIN
    if (targetUser.isGroupAdmin) {
      const adminCount = await User.countDocuments({
        groupId: currentUser.groupId,
        isGroupAdmin: true,
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          message: "Group must have at least one admin",
        });
      }
    }

    //  TOGGLE ADMIN
    targetUser.isGroupAdmin = !targetUser.isGroupAdmin;
    await targetUser.save();

    res.json({
      _id: targetUser._id,
      name: targetUser.name,
      email: targetUser.email,
      isGroupAdmin: targetUser.isGroupAdmin,
    });
  } catch (err) {
    console.error("TOGGLE GROUP ADMIN ERROR:", err);
    res.status(500).json({
      message: "Failed to update admin role",
    });
  }
};
