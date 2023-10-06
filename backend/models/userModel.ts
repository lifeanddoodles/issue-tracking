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
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
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
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      enum: [
        "CUSTOMER_SUCCESS",
        "DEVELOPMENT",
        "TESTING",
        "PRODUCT",
        "MANAGEMENT",
        "UNASSIGNED",
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
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model<IUserDocument>("User", userSchema);
