import express from "express";
import {
  addComment,
  deleteComment,
  getComment,
  getComments,
  updateComment,
} from "../controllers/commentControllers.js";

const router = express.Router();

// @desc Create comment
// @route POST /api/comments/
// @access Private
router.post("/", addComment);

// @desc Show all comments
// @route GET /api/comments/
// @access Public
router.get("/", getComments);

// @desc Show one comment
// @route GET /api/comments/:commentId
// @access Public
router.get("/:commentId", getComment);

// @desc Update comment
// @route UPDATE /api/comments/:commentId
// @access Private
router.patch("/:commentId", updateComment);

// @desc Delete comment
// @route DELETE /api/comments/:commentId
// @access Private
router.delete("/:commentId", deleteComment);

export default router;
