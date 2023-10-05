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
      required: true,
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
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IServiceDocument>("Service", serviceSchema);
