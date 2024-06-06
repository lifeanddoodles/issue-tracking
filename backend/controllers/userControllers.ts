import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { RootQuerySelector, Types } from "mongoose";
import { IUser, IUserDocument } from "../../shared/interfaces/index.js";
import Company from "../models/companyModel.js";
import User from "../models/userModel.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.ts";

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
      role = "CLIENT",
      company,
      position,
      department,
      avatarUrl,
      assignedAccounts,
      newAssignedAccount,
    } = req.body;

    // Handle user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Handle request with missing fields
    const missingFields =
      !firstName || !lastName || !email || !password || !role;

    if (missingFields) {
      res.status(400);
      throw new Error("Please add all required fields");
    }

    // Prepare new user data
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUserData: Partial<IUserDocument> = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      company,
      position,
      department,
      avatarUrl,
      assignedAccounts,
    };

    // Request user creation
    const createdUser = await User.create(newUserData);

    // Handle user creation error
    if (!createdUser) {
      res.status(400);
      throw new Error("User not created");
    }

    if (newAssignedAccount) {
      const companyToUpdate = await Company.findById(newAssignedAccount);

      companyToUpdate?.set({
        assignedRepresentative: createdUser._id,
      });

      await companyToUpdate?.save({
        validateBeforeSave: true,
      });
    }

    // Handle success
    const authUser: Partial<IUserDocument> | undefined = req.user;

    if (authUser) {
      res.status(201).json({
        _id: createdUser._id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        role: createdUser.role,
        company: createdUser.company,
        position: createdUser.position,
        department: createdUser.department,
        avatarUrl: createdUser.avatarUrl,
        assignedAccounts: createdUser.assignedAccounts,
      });
    } else {
      // Generate JWT token
      generateTokenAndSetCookie(res, createdUser._id as string);

      req.login(createdUser, function (err) {
        if (err) {
          return next(err);
        }

        res.status(201).json({
          _id: createdUser._id,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          email: createdUser.email,
          role: createdUser.role,
          company: createdUser.company,
          position: createdUser.position,
          department: createdUser.department,
          avatarUrl: createdUser.avatarUrl,
          assignedAccounts: createdUser.assignedAccounts,
        });
      });
    }
  }
);

// @desc    Get all users
// @route   GET /api/users/
// @access  Private
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  // Validation
  // Get authenticated user
  const authUser: Partial<IUserDocument> | undefined = req.user;
  const isClient = authUser?.role === "CLIENT";

  // Handle authenticated user not authorized for request
  if (isClient) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  // Find users
  const query: RootQuerySelector<IUser> = {};

  for (const key in req.query) {
    if (key === "company" && Types.ObjectId.isValid(req.query[key] as string)) {
      // If the query parameter for 'company' is a valid ObjectId, convert it
      query[key as keyof IUser] = new Types.ObjectId(req.query[key] as string);
    } else {
      query[key as keyof IUser] = req.query[key];
    }
  }

  const users: IUserDocument[] = await User.find(query).select("-password");

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
// @route PATCH /api/users/profile
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
// @route   PATCH /api/users/:userId
// @access  Private/Admin
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  // Prepare request variables (body, params, user, etc.)
  const { newAssignedAccount, assignedAccounts, ...updatedUserData } = req.body;
  const userId = req.params.userId;

  // Validation
  // Get authenticated user
  // Handle authenticated user not authorized for request

  // Request find user by ID and update
  const updatedUser = (await User.findById(userId).select(
    "-password"
  )) as IUserDocument;
  const companyToBeAssigned = await Company.findById(newAssignedAccount);

  // Handle user update error
  if (!updatedUser) {
    res.status(400);
    throw new Error("User not found");
  }

  const canBeAssignedAccounts =
    updatedUser.department === "CUSTOMER_SUCCESS" &&
    companyToBeAssigned?.tier !== "FREE";

  // Update user
  updatedUser.set({
    ...updatedUserData,
    ...(newAssignedAccount && canBeAssignedAccounts
      ? {
          assignedAccounts: Array.from(
            new Set([
              ...(updatedUser.assignedAccounts || []),
              newAssignedAccount,
            ])
          ),
        }
      : {}),
  });

  // Save updates to user
  await updatedUser.save({
    validateBeforeSave: true,
  });

  // Add assigned representative to company
  if (newAssignedAccount) {
    companyToBeAssigned?.set({
      assignedRepresentative: updatedUser._id,
    });

    await companyToBeAssigned?.save({
      validateBeforeSave: true,
    });
  }

  // Handle success
  res.status(200).json(updatedUser);
});

// @desc    Delete user
// @route   DELETE /api/users/:userId
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  // Prepare request variables (body, params, user, etc.)
  const userId = req.params.userId;

  // Validation
  // Get authenticated user
  // const authUser = req.user;

  // Handle authenticated user not authorized for request
  // if(authUser.role !== "ADMIN" && authUser._id !== user._id) {
  //   res.status(401)
  //   throw new Error("Not Authorized")
  // }

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
