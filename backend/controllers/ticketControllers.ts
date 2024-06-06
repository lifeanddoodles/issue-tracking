import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { RootQuerySelector, Types } from "mongoose";
import {
  IPersonInfo,
  ITicket,
  ITicketDocument,
  ITicketPopulatedDocument,
  ITicketWithStatics,
  IUserDocument,
  Priority,
  Status,
  TicketType,
  UserRole,
} from "../../shared/interfaces/index.js";
import Comment from "../models/commentModel.js";
import Ticket from "../models/ticketModel.js";

function getDeadlineAutoFill(priority: string) {
  switch (priority) {
    case "HIGH":
      return 2;
    case "LOW":
      return 8;
    case "MEDIUM":
    default:
      return 4;
  }
}

// @desc Create ticket
// @route POST /api/tickets/
// @access Private
export const addTicket = asyncHandler(async (req: Request, res: Response) => {
  // Get authenticated user
  const authUser: Partial<IUserDocument> | undefined = req.user;
  const isClient = authUser?.role === UserRole.CLIENT;

  // Prepare request variables (body, params, user, etc.)
  const {
    title,
    description,
    assignee,
    reporter,
    externalReporter,
    status = Status.OPEN,
    priority = Priority.LOW,
    assignToTeam,
    ticketType = isClient ? TicketType.FOLLOW_UP : TicketType.ISSUE,
    estimatedTime,
    deadline,
    isSubtask = false,
    parentTask = null,
  } = req.body;

  // Validation
  // Get authenticated user

  // Handle user not authorized for request

  // Handle request with missing fields
  const missingFields =
    !title || (!description && (!reporter || !externalReporter));

  if (missingFields) {
    res.status(400);
    throw new Error("Please add all required fields");
  }

  // Prepare new ticket data
  const newTicketData: Partial<ITicket> = {
    title,
    description,
    assignee,
    reporter,
    externalReporter,
    status,
    priority,
    assignToTeam,
    ticketType,
    estimatedTime,
    deadline,
    isSubtask,
    parentTask,
  };

  // Request ticket creation
  const newTicket: ITicketDocument = await Ticket.create(newTicketData);

  // Handle ticket creation error
  if (!newTicket) {
    res.status(400);
    throw new Error("Ticket not created");
  }

  // Handle success
  res.status(201).send(newTicket);
});

// @desc Get all tickets
// @route GET /api/tickets/
// @access Public
export const getTickets = asyncHandler(async (req: Request, res: Response) => {
  // Get authenticated user
  const authUser: Partial<IUserDocument> | undefined = req.user;
  const isClient = authUser?.role === UserRole.CLIENT;

  // Find tickets
  const query: RootQuerySelector<ITicketDocument> = {};

  for (const key in req.query) {
    if (key === "company") {
      query["projectInfo.company._id"] = new Types.ObjectId(
        req.query[key] as keyof ITicketDocument
      );
    } else if (key === "service") {
      query["serviceInfo._id"] = new Types.ObjectId(
        req.query[key] as keyof ITicketDocument
      );
    } else {
      query[key as keyof ITicketDocument] = req.query[key];
    }
  }

  if (isClient && !Object.hasOwn(req.query, "company")) {
    query["projectInfo.company._id"] = authUser?.company;
  }

  const tickets = await (Ticket as unknown as ITicketWithStatics)
    .aggregateTicketsWithProjectsAndServices!(query);

  // Handle tickets not found
  if (!tickets || tickets.length === 0) {
    res.status(404);
    throw new Error("Tickets not found");
  }

  // Populate assignee, reporter, and externalReporter fields
  await Ticket.populate(tickets, [
    { path: "assignee", select: "_id firstName lastName" },
    { path: "reporter", select: "_id firstName lastName" },
    { path: "externalReporter", select: "_id firstName lastName" },
  ]);

  // Handle success
  res.status(200).send(tickets);
});

// @desc  Get one ticket
// @route GET /api/tickets/:ticketId
// @access Public
export const getTicket = asyncHandler(async (req: Request, res: Response) => {
  // Prepare request variables (body, params, user, etc.)
  const ticketId = req.params.ticketId;

  // Find ticket
  const aggregatedTickets = await (Ticket as unknown as ITicketWithStatics)
    .aggregateTicketsWithProjectsAndServices!({
    _id: new Types.ObjectId(ticketId),
  });

  const ticket: ITicketWithStatics = aggregatedTickets[0];

  const populatedTicket = await Ticket.populate(ticket, [
    { path: "assignee", select: "_id firstName lastName" },
    { path: "reporter", select: "_id firstName lastName" },
    { path: "externalReporter", select: "_id firstName lastName" },
  ]);

  const comments = await Comment.find({ ticketId })
    .select("-ticketId, -__v")
    .populate("author", "_id firstName lastName")
    .sort({ createdAt: "desc" });

  // Handle ticket not found
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  // Validation
  // Get authenticated user
  const authUser: Partial<IUserDocument> | undefined = req.user;
  const isClient = authUser?.role === UserRole.CLIENT;
  const externalReporter = (populatedTicket as ITicketPopulatedDocument)
    ?.externalReporter as IPersonInfo;
  const clientCanRead = isClient && authUser._id === externalReporter?._id;

  // Handle authenticated user not authorized for request
  if (!clientCanRead) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  // Handle success
  res.status(200).json({ ticket, comments });
});

// @desc  Get all tickets by user
// @route GET /api/tickets/:userId
// @access Private
export const getTicketsByUser = asyncHandler(
  async (req: Request, res: Response) => {
    // Find user
    const authUser: Partial<IUserDocument> | undefined = req.user;
    const authUserId = authUser?._id;
    const isClient = authUser?.role === UserRole.CLIENT;
    const query = isClient
      ? { externalReporter: authUserId }
      : { reporter: authUserId };

    // Request tickets by user
    const ticketsByUser = await Ticket.find(query);

    // Handle tickets not found
    if (!ticketsByUser) {
      res.status(404);
      throw new Error("Tickets not found");
    }

    // Handle success
    res.status(200).send(ticketsByUser);
  }
);

// @desc Update ticket
// @route PATCH /api/tickets/:ticketId
// @access Private
export const updateTicket = asyncHandler(
  async (req: Request, res: Response) => {
    const updatedTicketData = req.body;
    const ticketId = req.params.ticketId;

    // Find ticket
    const ticket = await Ticket.findById(ticketId);

    // Handle ticket not found
    if (!ticket) {
      res.status(404);
      throw new Error("Ticket not found");
    }

    // Validation
    // Get authenticated user
    const authUser: Partial<IUserDocument> | undefined = req.user;
    const authUserId = authUser?._id;
    const isClient = authUser?.role === UserRole.CLIENT;
    const externalReporterId = ticket?.externalReporter;

    // Handle authenticated user not authorized for request
    if (
      isClient &&
      (authUserId !== externalReporterId || ticket?.assignToTeam)
    ) {
      res.status(401);
      throw new Error("Not Authorized");
    }

    // Request ticket update
    const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, {
      ...updatedTicketData,
    });

    // Handle ticket update error
    if (!updatedTicket) {
      res.status(400);
      throw new Error("Ticket not updated");
    }

    // Handle success
    res.status(200).send(updatedTicket);
  }
);

// @desc Delete ticket
// @route DELETE /api/tickets/:ticketId
// @access Private
export const deleteTicket = asyncHandler(
  async (req: Request, res: Response) => {
    // Prepare request variables (body, params, user, etc.)
    const ticketId = req.params.ticketId;

    const ticket = await Ticket.findById(ticketId);

    // Validation
    // Get authenticated user
    const authUser: Partial<IUserDocument> | undefined = req.user;
    const authUserId = authUser?._id;
    const isClient = authUser?.role === UserRole.CLIENT;
    const externalReporterId = ticket?.externalReporter?.toString();

    // Handle authenticated user not authorized for request
    if (isClient && authUserId !== externalReporterId) {
      res.status(401);
      throw new Error("Not Authorized");
    }

    // Request ticket deletion
    const deletedTicket = await Ticket.deleteOne({ _id: ticketId });

    // Handle ticket not found
    if (!deletedTicket) {
      res.status(404);
      throw new Error("Ticket not found");
    }

    // Handle success
    res.status(200).json({ message: "Ticket deleted successfully" });
  }
);
