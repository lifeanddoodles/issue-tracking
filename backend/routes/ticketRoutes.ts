import express from "express";
import {
  addTicket,
  deleteTicket,
  getTicket,
  getTickets,
  updateTicket,
} from "../controllers/ticketControllers.js";
import { ensureAuth } from "../middleware/auth.js";

const router = express.Router();

// @desc Create ticket
// @route POST /api/tickets/
// @access Private
router.post("/", ensureAuth, addTicket);

// @desc Show all tickets
// @route GET /api/tickets/
// @access Private
router.get("/", ensureAuth, getTickets);

// @desc Show all tickets by user
// @route GET /api/tickets/:user
// @access Private
// TODO

// @desc Show one ticket
// @route GET /api/tickets/:ticketId
// @access Private
router.get("/:ticketId", ensureAuth, getTicket);

// @desc Update ticket
// @route UPDATE /api/tickets/:ticketId
// @access Private
router.put("/:ticketId", ensureAuth, updateTicket);

// @desc Delete ticket
// @route DELETE /api/tickets/:ticketId
// @access Private
router.delete("/:ticketId", ensureAuth, deleteTicket);

export default router;
