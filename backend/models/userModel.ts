import mongoose from "mongoose";
import { IUserDocument } from "../../shared/interfaces/index.js";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please add a name"],
  },
  lastName: {
    type: String,
    required: [true, "Please add a last name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
  },
  role: {
    type: String,
    required: true,
    enum: ["CLIENT", "STAFF", "DEVELOPER", "ADMIN"],
    default: "CLIENT",
  },
  company: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
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

export default mongoose.model<IUserDocument>("User", userSchema);
