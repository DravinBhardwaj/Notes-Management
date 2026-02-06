import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

async function fixUsers() {
  await mongoose.connect(process.env.MONGODB_URI);

  const users = await User.find({
    $or: [
      { groupId: { $exists: false } },
      { groupId: null },
      { groupId: "" },
    ],
  });

  for (const user of users) {
    user.groupId = "default-group"; // change if you want
    await user.save();
  }

  console.log(`✅ Fixed ${users.length} users`);
  process.exit(0);
}

fixUsers();
