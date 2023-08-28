import { Request, Response } from "express";

// CREATE
// @desc    Create user
// @route   POST /api/users/
// @access  Public
export const addUser = async (req: Request, res: Response) => {
  try {
    // Prepare request variables (body, params, user, etc.)

    // Find user

    // Validation
    // Handle user already exists

    // Handle user not authorized for request

    // Handle request with missing fields

    // Request user creation

    // Handle success
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400);
    throw new Error("There was an error creating the user");
  }
};

// READ
// @desc    Get all users
// @route   GET /api/users/
// @access  Public
export const getUsers = async (req: Request, res: Response) => {
  try {
    // Prepare request variables (body, params, user, etc.)

    // Find users

    // Handle users not found

    // Handle success
    res.status(200).json({ message: "Users found successfully" });
  } catch (error) {
    res.status(400);
    throw new Error("There was an error getting the users");
  }
};

// @desc    Get one user
// @route   GET /api/users/:userId
// @access  Public
export const getUser = async (req: Request, res: Response) => {
  try {
    // Prepare request variables (body, params, user, etc.)

    // Find user

    // Handle user not found

    // Handle success
    res.status(200).json({ message: "User found successfully" });
  } catch (error) {
    res.status(400);
    throw new Error("There was an error getting the user");
  }
};

// UPDATE
// @desc    Update user
// @route   UPDATE /api/users/:userId
// @access  Private
export const updateUser = async (req: Request, res: Response) => {
  try {
    // Prepare request variables (body, params, user, etc.)

    // Find user

    // Handle user not found

    // Validation
    // Handle user not authorized for request

    // Handle request with missing fields

    // Request user update

    // Handle success
    res.status(201).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(400);
    throw new Error("There was an error updating the user");
  }
};

// DELETE
// @desc    Delete user
// @route   DELETE /api/users/:userId
// @access  Private
export const deleteUser = async (req: Request, res: Response) => {
  try {
    // Prepare request variables (body, params, user, etc.)

    // Find user

    // Handle user not found

    // Validation
    // Handle user not authorized for request

    // Request user deletion

    // Handle success
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(401);
    throw new Error("Not Authorized");
  }
};
