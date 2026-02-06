import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
  html: String,
  bgColor: String,
});

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    pages: [pageSchema],

    type: {
      type: String,
      enum: ["generated", "uploaded"], // 🔥 IMPORTANT
      required: true,
    },

    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    groupId: {
      type: String,
      required: true,
      index: true,
      trim: true,
      uppercase: true,
    },

    pdfUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
