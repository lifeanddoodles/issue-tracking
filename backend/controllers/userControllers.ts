import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IUser, UserRole } from "../../shared/interfaces/index.js";
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
    role = UserRole.CLIENT,
    company,
    position,
  } = req.body;

  // Validation
  // (Optional) Get authenticated user
  // Handle authenticated user not authorized for request
  // if (authUser.role === "CLIENT") {
  //   res.status(401)
  //   throw new Error ("Not Authorized")
  // }

  // Handle user already exists
  // TODO: Refactor to find user by email from MongoDB
  const users: IUser[] = db.users;
  const user: IUser | undefined = users.find((user) => user.email === email);
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

  // TODO: Remove temp function once we invoke correct function in MongoDB
  const createUser: (
    newUser: Partial<IUser>
  ) => Promise<Partial<IUser> | IUser> = async (newUser: Partial<IUser>) =>
    newUser;

  // Request user creation
  // TODO: Remove Partial<IUser> once we get a full IUser from correct function in MongoDB
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
  // TODO: Refactor to fetch users from MongoDB
  const users: IUser[] = db.users;

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

  // Find user
  // TODO: Refactor to find user by _id from MongoDB
  const users: IUser[] = db.users;
  const user: IUser | undefined = users.find(
    (user) => user._id === req.params.userId
  );

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

  // Find user
  // TODO: Refactor to find user by email from MongoDB
  const users: IUser[] = db.users;
  const user: IUser | undefined = users.find((user) => user.email === email);

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

  // TODO: Remove temp function once we invoke correct function in MongoDB
  const updateUser: (
    user: IUser,
    updatedUserData: Partial<IUser>
  ) => Promise<Partial<IUser> | IUser> = async (
    user: IUser,
    updatedUserData: Partial<IUser>
  ) => ({
    ...user,
    ...updatedUserData,
  });

  // Request user update
  // TODO: Remove Partial<IUser> once we get a full IUser from correct function in MongoDB
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
