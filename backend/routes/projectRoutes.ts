import express from "express";
import {
  addProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from "../controllers/projectControllers.js";
import { isAdmin } from "../middleware/authMiddleware.ts";

const router = express.Router();

// @desc Create project
// @route POST /api/projects/
// @access Private
router.post("/", addProject);

// @desc Show all projects
// @route GET /api/projects/
// @access Public
router.get("/", getProjects);

// @desc Show one project
// @route GET /api/projects/:projectId
// @access Public
router.get("/:projectId", getProject);

// @desc Update project
// @route PATCH /api/projects/:projectId
// @access Private
router.patch("/:projectId", updateProject);

// @desc Delete project
// @route DELETE /api/projects/:projectId
// @access Private
router.delete("/:projectId", isAdmin, deleteProject);

export default router;
