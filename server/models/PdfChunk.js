import mongoose from "mongoose";

const pdfChunkSchema = new mongoose.Schema(
  {
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
      index: true,
    },

    pageNumber: {
      type: Number,
      default: null,
    },

    chunkIndex: {
      type: Number,
      required: true,
      min: 0,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    embedding: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

pdfChunkSchema.index({
  noteId: 1,
  chunkIndex: 1,
});

export default mongoose.model(
  "PdfChunk",
  pdfChunkSchema
);