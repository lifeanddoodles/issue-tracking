import express from "express";
import {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/userControllers.js";

const router = express.Router();

// CREATE
// @desc Create user
// @route POST /api/users/
// @access Private
router.post("/", addUser);

// READ
// @desc Show all users
// @route GET /api/users/
// @access Public
router.get("/", getUsers);

// @desc Show all users by user
// @route GET /api/users/:user
// @access Public
// TODO

// @desc Show one user
// @route GET /api/users/:userId
// @access Public
router.get("/:userId", getUser);

// UPDATE
// @desc Update user
// @route UPDATE /api/users/:userId
// @access Private
router.put("/:userId", updateUser);

// DELETE
// @desc Delete user
// @route DELETE /api/users/:userId
// @access Private
router.delete("/:userId", deleteUser);

export default router;
