import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  IUser,
  IUserDocument,
  UserRole,
} from "../../shared/interfaces/index.js";
import User from "../models/userModel.js";

// @desc    Create user
// @route   POST /api/users/
// @access  Public
export const addUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Prepare request variables (body, params, user, etc.)
    const {
      firstName,
      lastName,
      email,
      password,
      role = UserRole.CLIENT,
      company,
      position,
    } = req.body;

    // Handle user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Handle request with missing fields
    const missingFields =
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !role ||
      !company ||
      !position;

    if (missingFields) {
      res.status(400);
      throw new Error("Please add all required fields");
    }

    // Prepare new user data
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: Partial<IUser> = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      company,
      position,
      createdAt: new Date(),
      lastModifiedAt: new Date(),
    };

    // Request user creation
    const createdUser = await User.create(newUser);

    // Handle user creation error
    if (!createdUser) {
      res.status(400);
      throw new Error("User not created");
    }

    // Handle success
    req.login(createdUser, function (err) {
      if (err) {
        return next(err);
      }
      return res.status(201).json(createdUser);
    });
  }
);

// @desc    Get all users
// @route   GET /api/users/
// @access  Private/Admin
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  // Find users
  const users = await User.find().select("-password");

  // Handle users not found
  if (!users) {
    res.status(404);
    throw new Error("Users not found");
  }

  // Handle success
  res.status(200).send(users);
});

// @desc Show user's profile
// @route GET /api/users/profile
// @access Private
export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    // Prepare request variables (body, params, user, etc.)
    const reqUser = req?.user as Partial<IUserDocument>;
    const userId = reqUser._id;

    // Find user in database
    const user = await User.findById(userId).select("-password");

    // Handle user not found
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Handle success
    res.status(200).json(user);
  }
);

// @desc Update user's profile
// @route PUT /api/users/profile
// @access Private
export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    // Prepare request variables (body, params, user, etc.)
    const reqUser = req?.user as Partial<IUserDocument>;
    const userId = reqUser._id;

    // Find user in database
    const user = await User.findById(userId);

    // Handle user not found
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Update all user attributes which are different or missing from user with values from req.body
    Object.assign(user, req.body);

    const updatedUser = await user.save();

    // Validate
    // Handle success
    res.status(200).json(updatedUser);
  }
);

// @desc    Get one user
// @route   GET /api/users/:userId
// @access  Private/Admin
export const getUser = asyncHandler(async (req: Request, res: Response) => {
  // Prepare request variables (body, params, user, etc.)
  const userId = req.params.userId;

  // Find user
  const user = await User.findById(userId).select("-password");

  // Handle user not found
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Handle success
  res.status(200).json(user);
});

// @desc    Update user
// @route   UPDATE /api/users/:userId
// @access  Private/Admin
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  // Prepare request variables (body, params, user, etc.)
  const { firstName, lastName, email, role, company, position, avatarUrl } =
    req.body;
  const userId = req.params.userId;

  // Validation
  // Get authenticated user
  // Handle authenticated user not authorized for request

  // Handle request with missing fields
  const missingFields =
    !firstName || !lastName || !email || !role || !company || !position;

  if (missingFields) {
    res.status(400);
    throw new Error("Please add all required fields");
  }

  // Prepare updated user data
  const updatedUserData: Partial<IUser> = {
    firstName,
    lastName,
    email,
    role,
    company,
    position,
    avatarUrl,
    lastModifiedAt: new Date(),
  };

  // Request find user by ID and update
  const updatedUser = await User.findByIdAndUpdate(userId, {
    ...updatedUserData,
  }).select("-password");

  // Handle user update error
  if (!updatedUser) {
    res.status(400);
    throw new Error("User not updated");
  }

  // Handle success
  res.status(200).send(updatedUser);
});

// @desc    Delete user
// @route   DELETE /api/users/:userId
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  // Prepare request variables (body, params, user, etc.)
  const userId = req.params.userId;

  // Validation
  // Get authenticated user
  // Handle authenticated user not authorized for request

  // Request user deletion
  const deletedUser = await User.findByIdAndDelete(userId);

  // Handle user not found
  if (!deletedUser) {
    res.status(404);
    throw new Error("User not found");
  }

  // Handle success
  res.status(200).json({ message: "User deleted successfully" });
});
