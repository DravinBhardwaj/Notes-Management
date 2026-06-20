import mongoose from "mongoose";
import PdfChunk from "../models/PdfChunk.js";
import { generateEmbedding } from "./generateEmbedding.js";

export const searchChunks = async (
  noteId,
  question,
  limit = 5
) => {
  const queryVector =
    await generateEmbedding(question);

  if (!queryVector.length) {
    return [];
  }

  const results =
    await PdfChunk.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector,
          numCandidates: 100,
          limit,
          filter: {
            noteId:
              new mongoose.Types.ObjectId(
                noteId
              ),
          },
        },
      },
      {
        $project: {
          text: 1,
          pageNumber: 1,
          score: {
            $meta:
              "vectorSearchScore",
          },
        },
      },
    ]);

  return results;
};