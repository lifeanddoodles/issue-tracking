import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IUser } from "../../shared/interfaces/index.js";
import db from "../config/db.json" assert { type: "json" };

// CREATE
// @desc    Create user
// @route   POST /api/users/
// @access  Public
export const addUser = asyncHandler(async (req: Request, res: Response) => {
  // Prepare request variables (body, params, user, etc.)
  const {
    firstName,
    lastName,
    email,
    password,
    role = "CLIENT",
    company,
    position,
  } = req.body;

  // Validation
  // (Optional) Find authenticated user
  // Handle authenticated user not authorized for request
  // if (authUser.role === "CLIENT") {
  //   res.status(401)
  //   throw new Error ("Not Authorized")
  // }

  // Handle user already exists
  const users = db.users;
  const user = users.find((user) => user.email === email);
  if (user) {
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
  const newUser: Partial<IUser> = {
    firstName,
    lastName,
    email,
    password,
    role,
    company,
    position,
    createdAt: new Date(),
    lastModifiedAt: new Date(),
  };

  const createUser: (
    newUser: Partial<IUser>
  ) => Promise<Partial<IUser> | IUser> = async (newUser: Partial<IUser>) =>
    newUser;

  // Request user creation
  // TODO: Remove Partial<IUser> once connected to MongoDB
  const createdUser: IUser | Partial<IUser> = await createUser(newUser);

  // Handle user creation error
  if (!createdUser) {
    res.status(400);
    throw new Error("User not created");
  }

  // Handle success
  res.status(201).send(createdUser);
});

// READ
// @desc    Get all users
// @route   GET /api/users/
// @access  Public
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  // Prepare request variables (body, params, user, etc.)

  // Find users
  const users = db.users;

  // Handle users not found
  if (!users) {
    res.status(404);
    throw new Error("Users not found");
  }

  // Handle success
  res.status(200).send(users);
});

// @desc    Get one user
// @route   GET /api/users/:userId
// @access  Public
export const getUser = asyncHandler(async (req: Request, res: Response) => {
  // Prepare request variables (body, params, user, etc.)
  const users = db.users;

  // Find user
  const user = users.find((user) => user._id === req.params.userId);

  // Handle user not found
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Handle success
  res.status(200).send(user);
});

// UPDATE
// @desc    Update user
// @route   UPDATE /api/users/:userId
// @access  Private
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  // Prepare request variables (body, params, user, etc.)
  const { firstName, lastName, email, role, company, position } = req.body;
  const users = db.users;

  // Find user
  // TODO: Change to find by _id
  const user: IUser | Partial<IUser> | undefined = users.find(
    (user) => user.email === email
  );

  // Handle user not found
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

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
    lastModifiedAt: new Date(),
  };

  const updateUser: (
    user: Partial<IUser>,
    updatedUserData: Partial<IUser>
  ) => Promise<Partial<IUser> | IUser> = async (
    user: Partial<IUser>,
    updatedUserData: Partial<IUser>
  ) => ({
    ...user,
    ...updatedUserData,
  });

  // Request user update
  // TODO: Remove Partial<IUser> once connected to MongoDB
  const updatedUser: Partial<IUser> | IUser = await updateUser(
    user,
    updatedUserData
  );

  // Handle user update error
  if (!updatedUser) {
    res.status(400);
    throw new Error("User not updated");
  }

  // Handle success
  res.status(201).send(updatedUser);
});

// DELETE
// @desc    Delete user
// @route   DELETE /api/users/:userId
// @access  Private
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  // Prepare request variables (body, params, user, etc.)

  // Find user

  // Handle user not found

  // Validation
  // Get authenticated user
  // Handle authenticated user not authorized for request

  // Request user deletion

  // Handle success
  res.status(200).json({ message: "User deleted successfully" });
});
