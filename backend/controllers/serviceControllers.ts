import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { RootQuerySelector } from "mongoose";
import {
  IServiceBase,
  IServiceDocument,
  IUserDocument,
} from "../../shared/interfaces/index.js";
import Service from "../models/serviceModel.js";

// @desc Create service
// @route POST /api/services/
// @access Private
export const addService = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;

  // Validation
  const authUser: Partial<IUserDocument> | undefined = req.user;
  const isClient = authUser?.role === "CLIENT";

  // Client is not authorized for request
  if (isClient) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  // Handle request with missing fields
  const missingFields = !name;

  if (missingFields) {
    res.status(400);
    throw new Error("Please add all required fields");
  }

  // Prepare new service data
  const newServiceData: Partial<IServiceBase> = {
    name,
    ...req.body,
  };

  // Request service creation
  const newService: IServiceDocument = await Service.create(newServiceData);

  // Handle service creation error
  if (!newService) {
    res.status(400);
    throw new Error("Service not created");
  }

  // Handle success
  res.status(201).send(newService);
});

// @desc Get all services
// @route GET /api/services/
// @access Public
export const getServices = asyncHandler(async (req: Request, res: Response) => {
  // Find services
  const query: RootQuerySelector<IServiceDocument> = {};

  for (const key in req.query) {
    query[key as keyof IServiceDocument] = req.query[key];
  }

  const services = await Service.find(query);

  // Handle services not found
  if (!services) {
    res.status(404);
    throw new Error("Services not found");
  }

  // Handle success
  res.status(200).send(services);
});

// @desc  Get one service
// @route GET /api/services/:serviceId
// @access Public
export const getService = asyncHandler(async (req: Request, res: Response) => {
  // Prepare request variables (body, params, user, etc.)
  const serviceId = req.params.serviceId;

  // Find service
  const service = await Service.findById(serviceId);

  // Handle service not found
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  // Handle success
  res.status(200).send(service);
});

// @desc Update service
// @route UPDATE /api/services/:serviceId
// @access Private
export const updateService = asyncHandler(
  async (req: Request, res: Response) => {
    const updatedServiceData = req.body;
    const serviceId = req.params.serviceId;

    // Validation
    const authUser: Partial<IUserDocument> | undefined = req.user;
    const isClient = authUser?.role === "CLIENT";

    // Client is not authorized for request
    if (isClient) {
      res.status(401);
      throw new Error("Not Authorized");
    }

    // Request service update
    const updatedService = await Service.findByIdAndUpdate(serviceId, {
      ...updatedServiceData,
    });

    // Handle service update error
    if (!updatedService) {
      res.status(400);
      throw new Error("Service not updated");
    }

    // Handle success
    res.status(200).send(updatedService);
  }
);

// @desc Delete service
// @route DELETE /api/services/:serviceId
// @access Private
export const deleteService = asyncHandler(
  async (req: Request, res: Response) => {
    const serviceId = req.params.serviceId;

    // Validation
    // Get authenticated user
    const authUser: Partial<IUserDocument> | undefined = req.user;
    const isAdmin = authUser?.role === "ADMIN";

    // Handle authenticated user not authorized for request
    if (!isAdmin) {
      res.status(401);
      throw new Error("Not Authorized");
    }

    // Request service deletion
    const deletedService = await Service.findByIdAndDelete(serviceId);

    // Handle service not found
    if (!deletedService) {
      res.status(404);
      throw new Error("Service not found");
    }

    // Handle success
    res.status(200).json({ message: "Service deleted successfully" });
  }
);
