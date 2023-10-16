import mongoose from "mongoose";
import { IServiceDocument } from "../../shared/interfaces/index.js";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    url: {
      type: String,
    },
    version: {
      type: String,
      trim: true,
    },
    tier: {
      type: String,
      enum: ["FREE", "PRO", "ENTERPRISE"],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IServiceDocument>("Service", serviceSchema);
