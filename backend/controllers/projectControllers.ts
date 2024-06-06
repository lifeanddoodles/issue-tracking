import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { RootQuerySelector, Types } from "mongoose";
import {
  IProjectBase,
  IProjectDocument,
  IUserDocument,
} from "../../shared/interfaces/index.js";
import Project from "../models/projectModel.js";

// @desc Create project
// @route POST /api/projects/
// @access Private
export const addProject = asyncHandler(async (req: Request, res: Response) => {
  // Prepare request variables (body, params, user, etc.)
  const { name, company, url, description, services, tickets } = req.body;

  // Handle request with missing fields
  const missingFields = !name || !company;

  if (missingFields) {
    res.status(400);
    throw new Error("Please add all required fields");
  }

  // Prepare new project data
  const newProjectData: Partial<IProjectBase> = {
    name,
    company,
    url,
    description,
    services,
    tickets,
  };

  // Request project creation
  const newProject: IProjectDocument = await Project.create(newProjectData);

  // Handle project creation error
  if (!newProject) {
    res.status(400);
    throw new Error("Project not created");
  }

  // Handle success
  res.status(201).send(newProject);
});

// READ
// @desc Get all projects
// @route GET /api/projects/
// @access Public
export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  // Get authenticated user
  const authUser: Partial<IUserDocument> | undefined = req.user;
  const isClient = authUser?.role === "CLIENT";

  // Find projects
  const query: RootQuerySelector<IProjectDocument> = {};

  for (const key in req.query) {
    if (key === "services") {
      query.services = {
        $in: [req.query[key]],
      };
    } else if (key === "company") {
      query.company = new Types.ObjectId(
        req.query[key] as keyof IProjectDocument
      );
    } else {
      query[key as keyof IProjectDocument] = req.query[key];
    }
  }

  // Restrict query to user's company
  if (isClient) {
    query.company = authUser?.company;
  }

  const projects = await Project.find(query).populate({
    path: "company",
    select: "name",
  });

  // Handle projects not found
  if (!projects) {
    res.status(404);
    throw new Error("Projects not found");
  }

  // Handle success
  res.status(200).send(projects);
});

// @desc  Get one project
// @route GET /api/projects/:projectId
// @access Public
export const getProject = asyncHandler(async (req: Request, res: Response) => {
  // Prepare request variables (body, params, user, etc.)
  const projectId = req.params.projectId;

  // Find project
  const project = await Project.findById(projectId);

  // Handle project not found
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Validation
  // Get authenticated user
  // const authUser: Partial<IUserDocument> | undefined = req.user;

  // Handle authenticated user not authorized for request
  // if is client and not company employee
  // TODO: Add as middleware?

  // Handle success
  res.status(200).send(project);
});

// @desc  Get all projects by user
// @route GET /api/projects/:userId
// @access Private
export const getProjectsByUserCompany = asyncHandler(
  async (req: Request, res: Response) => {
    // Find user
    const authUser: Partial<IUserDocument> | undefined = req.user;
    const companyId = authUser?.company!.toString();
    const query = { company: companyId };

    // Request projects by user's company
    const projectsByUser = await Project.find(query);

    // Handle projects not found
    if (!projectsByUser) {
      res.status(404);
      throw new Error("Projects not found");
    }

    // Handle success
    res.status(200).send(projectsByUser);
  }
);

// @desc Update project
// @route UPDATE /api/projects/:projectId
// @access Private
export const updateProject = asyncHandler(
  async (req: Request, res: Response) => {
    const updatedProjectData = req.body;
    const projectId = req.params.projectId;

    // Find project
    const project = await Project.findById(projectId);

    // Handle project not found
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    // Validation
    // Get authenticated user
    // const authUser: Partial<IUserDocument> | undefined = req.user;

    // Handle authenticated user not authorized for request
    // if is client and not company employee
    // TODO: Add as middleware?

    // Request project update
    const updatedProject = await Project.findByIdAndUpdate(projectId, {
      ...updatedProjectData,
    });

    // Handle project update error
    if (!updatedProject) {
      res.status(400);
      throw new Error("Project not updated");
    }

    // Handle success
    res.status(200).send(updatedProject);
  }
);

// DELETE
// @desc Delete project
// @route DELETE /api/projects/:projectId
// @access Private
export const deleteProject = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = req.params.projectId;

    // Find project
    const project = await Project.findById(projectId);

    // Validation
    // Get authenticated user
    // const authUser: Partial<IUserDocument> | undefined = req.user;

    // Handle authenticated user not authorized for request
    // if is client and not company employee
    // TODO: Add as middleware?

    // Request project deletion
    const deletedProject = await Project.deleteOne({ _id: projectId });

    // Handle project not found
    if (!deletedProject) {
      res.status(404);
      throw new Error("Project not found");
    }

    // Handle success
    res.status(200).json({ message: "Project deleted successfully" });
  }
);
