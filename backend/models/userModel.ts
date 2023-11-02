import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { IUserDocument } from "../../shared/interfaces/index.js";

const userSchema = new mongoose.Schema(
  {
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
      unique: true,
    },
    password: {
      type: String,
    },
    username: {
      type: String,
    },
    googleId: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ["CLIENT", "STAFF", "DEVELOPER", "ADMIN"],
      default: "CLIENT",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    position: {
      type: String,
    },
    department: {
      type: String,
      enum: [
        "CUSTOMER_SUCCESS",
        "DEVELOPMENT",
        "TESTING",
        "PRODUCT",
        "MANAGEMENT",
      ],
    },
  },
  { timestamps: true }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

export default mongoose.model<IUserDocument>("User", userSchema);
