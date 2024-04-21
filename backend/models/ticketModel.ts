import mongoose from "mongoose";
import { ITicketDocument } from "../../shared/interfaces/index.js";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    attachments: {
      type: [String],
      required: true,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    externalReporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    originalTicket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
    status: {
      type: String,
      default: "OPEN",
      enum: ["OPEN", "IN_PROGRESS", "CLOSED"],
      required: true,
    },
    priority: {
      type: String,
      default: "MEDIUM",
      enum: ["LOW", "MEDIUM", "HIGH"],
      required: true,
    },
    assignToTeam: {
      type: String,
      enum: ["DEVELOPMENT", "QUALITY_ASSURANCE", "PRODUCT", "CUSTOMER_SUCCESS"],
    },
    ticketType: {
      type: String,
      default: "ISSUE",
      enum: ["ISSUE", "BUG", "FEATURE_REQUEST", "FOLLOW_UP"],
    },
    estimatedTime: {
      type: Number,
    },
    deadline: {
      type: Date,
    },
    isSubtask: {
      type: Boolean,
      default: false,
    },
    parentTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITicketDocument>("Ticket", ticketSchema);
