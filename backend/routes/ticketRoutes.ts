import express from "express";
import {
  addTicket,
  deleteTicket,
  getTicket,
  getTickets,
  updateTicket,
} from "../controllers/ticketControllers.js";
import { ensureAuth, isAdmin } from "../middleware/authMiddleware.ts";
import formatResults from "../middleware/formatResults.ts";
import Ticket from "../models/ticketModel.ts";

const router = express.Router();

// @desc Create ticket
// @route POST /api/tickets/
// @access Private
router.post("/", ensureAuth, addTicket);

// @desc Show all tickets
// @route GET /api/tickets/
// @access Private
router.get(
  "/",
  ensureAuth,
  formatResults(
    Ticket,
    [
      { path: "assignee", select: "_id firstName lastName" },
      { path: "reporter", select: "_id firstName lastName" },
      { path: "externalReporter", select: "_id firstName lastName" },
    ],
    {
      staticsFnName: "aggregateTicketsWithProjectsAndServices",
      replaceFind: true,
    }
  ),
  getTickets
);

// @desc Show all tickets by user
// @route GET /api/tickets/:user
// @access Private
// TODO

// @desc Show one ticket
// @route GET /api/tickets/:ticketId
// @access Private
router.get("/:ticketId", ensureAuth, getTicket);

// @desc Update ticket
// @route PATCH /api/tickets/:ticketId
// @access Private
router.patch("/:ticketId", ensureAuth, updateTicket);

// @desc Delete ticket
// @route DELETE /api/tickets/:ticketId
// @access Private
router.delete("/:ticketId", ensureAuth, isAdmin, deleteTicket);

export default router;
