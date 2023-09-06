import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  ITicket,
  ITicketDocument,
  Priority,
  Status,
} from "../../shared/interfaces/index.js";
import { addDays } from "../../shared/utils/index.js";
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
  // Prepare request variables (body, params, user, etc.)
  const {
    title,
    description,
    assignee,
    reporter,
    status = Status.OPEN,
    priority = Priority.LOW,
    deadline,
    moveToDevSprint = false,
    isSubtask = false,
    parentTask = null,
  } = req.body;

  // Validation
  // Get authenticated user

  // Handle user not authorized for request

  // Handle request with missing fields
  const missingFields = !title || !description || !reporter;

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
    status,
    priority,
    moveToDevSprint,
    deadline,
    isSubtask,
    parentTask,
    createdAt: new Date(),
    lastModifiedAt: new Date(),
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
  // Find tickets
  const tickets = await Ticket.find();

  // Handle tickets not found
  if (!tickets) {
    res.status(404);
    throw new Error("Tickets not found");
  }

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
  const ticket = await Ticket.findById(ticketId)
    .populate("assignee", "_id firstName lastName")
    .populate("reporter", "_id firstName lastName");
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

  // Handle success
  res.status(200).json({ ticket, comments });
});

// @desc  Get all tickets by user
// @route GET /api/tickets/:userId
// @access Private
export const getTicketsByUser = asyncHandler(
  async (req: Request, res: Response) => {
    // Prepare request variables (body, params, user, etc.)

    // Find user

    // Handle user not found

    // Request tickets by user

    // Handle tickets not found

    // Handle success
    res.status(200).json({ message: "Tickets found successfully" });
  }
);

// @desc Update ticket
// @route UPDATE /api/tickets/:ticketId
// @access Private
export const updateTicket = asyncHandler(
  async (req: Request, res: Response) => {
    // Prepare request variables (body, params, user, etc.)
    const {
      title,
      description,
      assignee,
      reporter,
      status,
      priority,
      deadline,
      moveToDevSprint,
      isSubtask,
      parentTask,
    } = req.body;
    const ticketId = req.params.ticketId;

    // Find ticket

    // Handle ticket not found

    // Validation
    // Get authenticated user

    // Handle authenticated user not authorized for request

    // Handle request with missing fields
    const missingFields = !title || !description || !reporter;

    if (missingFields) {
      res.status(400);
      throw new Error("Please add all required fields");
    }

    // Prepare updated ticket data
    const updatedTicketData = {
      title,
      description,
      assignee,
      reporter,
      status,
      priority,
      deadline: deadline || addDays(new Date(), getDeadlineAutoFill(priority)),
      moveToDevSprint,
      isSubtask,
      parentTask,
      lastModifiedAt: new Date(),
    };

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

    // Validation
    // Get authenticated user

    // Handle authenticated user not authorized for request

    // Request ticket deletion
    const deletedTicket = await Ticket.findByIdAndDelete(ticketId);

    // Handle ticket not found
    if (!deletedTicket) {
      res.status(404);
      throw new Error("Ticket not found");
    }

    // Handle success
    res.status(200).json({ message: "Ticket deleted successfully" });
  }
);
