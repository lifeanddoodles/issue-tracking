import express from "express";
import {
  addTicket,
  deleteTicket,
  getTicket,
  getTickets,
  updateTicket,
} from "../controllers/ticketControllers.js";
const router = express.Router();

// @desc Create ticket
// @route POST /api/tickets/
// @access Private
router.post("/", addTicket);

// @desc Show all tickets
// @route GET /api/tickets/
// @access Public
router.get("/", getTickets);

// @desc Show all tickets by user
// @route GET /api/tickets/:user
// @access Public
// TODO

// @desc Show one ticket
// @route GET /api/tickets/:ticketId
// @access Public
router.get("/:ticketId", getTicket);

// @desc Update ticket
// @route UPDATE /api/tickets/:ticketId
// @access Private
router.put("/:ticketId", updateTicket);

// @desc Delete ticket
// @route DELETE /api/tickets/:ticketId
// @access Private
router.delete("/:ticketId", deleteTicket);

export default router;
