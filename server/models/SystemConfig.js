import mongoose from "mongoose";

const systemConfigSchema = new mongoose.Schema(
  {
    postingEnabled: {
      type: Boolean,
      default: true, //  allow posting by default
    },
  },
  { timestamps: true }
);

export default mongoose.model("SystemConfig", systemConfigSchema);
