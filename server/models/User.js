import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    /*  SYSTEM ROLE (GLOBAL) */
    role: {
      type: String,
      enum: ["student", "superadmin"],
      default: "student",
    },

    /*  GROUP IDENTIFIER */
    groupId: {
      type: String,
      required: true,
      index: true,
      lowercase:true,
      trim:true,
    },

    /*  GROUP-LEVEL ADMIN */
    isGroupAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
