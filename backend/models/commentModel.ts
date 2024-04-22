import mongoose from "mongoose";
import { ICommentDocument } from "../../shared/interfaces/index.js";

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User",
      required: true,
      validate: {
        validator: function (value: string | mongoose.Types.ObjectId) {
          // Check if value is either a string or an ObjectId
          return (
            typeof value === "string" ||
            value instanceof mongoose.Types.ObjectId
          );
        },
        message: "Author must be either a string or an ObjectId",
      },
    },
    message: {
      type: String,
      required: true,
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICommentDocument>("Comment", commentSchema);
