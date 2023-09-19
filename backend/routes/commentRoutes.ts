import express from "express";
import {
  addComment,
  deleteComment,
  getComment,
  getComments,
  updateComment,
} from "../controllers/commentControllers.js";
import { ensureAuth } from "../middleware/auth.js";

const router = express.Router();

// @desc Create comment
// @route POST /api/comments/
// @access Private
router.post("/", ensureAuth, addComment);

// @desc Show all comments
// @route GET /api/comments/
// @access Private
router.get("/", ensureAuth, getComments);

// @desc Show one comment
// @route GET /api/comments/:commentId
// @access Private
router.get("/:commentId", ensureAuth, getComment);

// @desc Update comment
// @route UPDATE /api/comments/:commentId
// @access Private
router.patch("/:commentId", ensureAuth, updateComment);

// @desc Delete comment
// @route DELETE /api/comments/:commentId
// @access Private
router.delete("/:commentId", ensureAuth, deleteComment);

export default router;
