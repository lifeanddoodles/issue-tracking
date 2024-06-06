import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  IComment,
  ICommentDocument,
  IUserDocument,
} from "../../shared/interfaces/index.js";
import Comment from "../models/commentModel.js";

// @desc Create comment
// @route POST /api/comments/
// @access Private
export const addComment = asyncHandler(async (req: Request, res: Response) => {
  // Prepare request variables (body, params, user, etc.)
  const { ticketId, author, message, isEdited = false } = req.body;

  // Handle request with missing fields
  const missingFields = !ticketId || !author || !message;

  if (missingFields) {
    res.status(400);
    throw new Error("Please add all required fields");
  }

  // Prepare new comment data
  const newCommentData: Partial<IComment> = {
    ticketId,
    author,
    message,
    isEdited,
  };

  // Request comment creation
  const newComment: ICommentDocument = await Comment.create(newCommentData);

  // Handle comment creation error
  if (!newComment) {
    res.status(400);
    throw new Error("Comment not created");
  }

  // Handle success
  res.status(201).send(newComment);
});

// @desc Get all comments
// @route GET /api/comments/
// @access Public
export const getComments = asyncHandler(async (req: Request, res: Response) => {
  // Find comments
  const comments = await Comment.find();

  // Handle comments not found
  if (!comments) {
    res.status(404);
    throw new Error("Comments not found");
  }

  // Handle success
  res.status(200).send(comments);
});

// @desc  Get one comment
// @route GET /api/comments/:commentId
// @access Public
export const getComment = asyncHandler(async (req: Request, res: Response) => {
  // Prepare request variables (body, params, user, etc.)
  const commentId = req.params.commentId;

  // Find comment
  const comment = await Comment.findById(commentId).populate(
    "ticketId",
    "_id title"
  );

  // Handle comment not found
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  // Handle success
  res.status(200).send(comment);
});

// @desc  Get all comments by user
// @route GET /api/comments/:userId
// @access Private
export const getCommentsByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const authUser: Partial<IUserDocument> | undefined = req.user;
    const authUserId = (authUser?._id as string).toString();

    // Request comments by user
    const comments = await Comment.find({ author: authUserId });

    // Handle comments not found
    if (!comments) {
      res.status(404);
      throw new Error("Comments not found");
    }

    // Handle success
    res.status(200).send(comments);
  }
);

// @desc Update comment
// @route UPDATE /api/comments/:commentId
// @access Private
export const updateComment = asyncHandler(
  async (req: Request, res: Response) => {
    // Prepare request variables (body, params, user, etc.)
    const { message } = req.body;
    const commentId = req.params.commentId;

    // Validation
    // Get authenticated user
    // const authUser: Partial<IUserDocument> | undefined = req.user;
    // const authUserId = authUser?._id.toString();
    // const isAdmin = authUser?.role === UserRole.ADMIN;

    // Handle authenticated user not authorized for request
    // TODO: Add as middleware?
    // if(!isAdmin && authUserId !== comment.author.toString()) {
    //   res.status(401)
    //   throw new Error ("Not Authorized")
    // }

    // Handle request with missing fields
    const missingFields = !message;

    if (missingFields) {
      res.status(400);
      throw new Error("Please add all required fields");
    }

    // Prepare updated comment data
    const updatedCommentData = {
      message,
      isEdited: true,
    };

    // Request comment update
    const updatedComment = await Comment.findByIdAndUpdate(commentId, {
      ...updatedCommentData,
    });

    // Handle comment update error
    if (!updatedComment) {
      res.status(400);
      throw new Error("Comment not updated");
    }

    // Handle success
    res.status(200).send(updatedComment);
  }
);

// @desc Delete comment
// @route DELETE /api/comments/:commentId
// @access Private
export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    // Prepare request variables (body, params, user, etc.)
    const commentId = req.params.commentId;

    // Validation
    // Get authenticated user
    // const authUser: Partial<IUserDocument> | undefined = req.user;
    // const authUserId = authUser?._id.toString();
    // const isAdmin = authUser?.role === UserRole.ADMIN;

    // Handle authenticated user not authorized for request
    // TODO: Add as middleware?
    // if(!isAdmin && authUserId !== comment.author.toString()) {
    //   res.status(401)
    //   throw new Error ("Not Authorized")
    // }

    // Request comment deletion
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    // Handle comment not found
    if (!deletedComment) {
      res.status(404);
      throw new Error("Comment not found");
    }

    // Handle success
    res.status(200).json({ message: "Comment deleted successfully" });
  }
);
