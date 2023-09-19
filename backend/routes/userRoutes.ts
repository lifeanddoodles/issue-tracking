import express from "express";
import {
  addUser,
  deleteUser,
  getUser,
  getUserProfile,
  getUsers,
  updateUser,
  updateUserProfile,
} from "../controllers/userControllers.js";
import { ensureAuth, ensureGuest } from "../middleware/auth.js";

const router = express.Router();

// CREATE
// @desc Create user
// @route POST /api/users/
// @access Public
router.post("/", ensureGuest, addUser);

// READ
// @desc Show all users
// @route GET /api/users/
// @access Private
router.get("/", ensureAuth, getUsers);

// PROFILE
// @desc Show user's profile
// @route GET /api/users/profile
// @access Private
router.get("/profile", ensureAuth, getUserProfile);

// UPDATE PROFILE
// @desc Show user's profile
// @route PUT /api/users/profile
// @access Private/Admin
router.put("/profile", ensureAuth, updateUserProfile);

// @desc Show one user
// @route GET /api/users/:userId
// @access Private/Admin
router.get("/:userId", ensureAuth, getUser);

// UPDATE
// @desc Update user
// @route UPDATE /api/users/:userId
// @access Private/Admin
router.put("/:userId", ensureAuth, updateUser);

// DELETE
// @desc Delete user
// @route DELETE /api/users/:userId
// @access Private/Admin
router.delete("/:userId", ensureAuth, deleteUser);

export default router;
