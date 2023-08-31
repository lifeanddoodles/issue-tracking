import mongoose from "mongoose";
import { ITicketDocument } from "../../shared/interfaces/index.js";

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
  moveToDevSprint: {
    type: Boolean,
    default: false,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ITicketDocument>("Ticket", ticketSchema);
