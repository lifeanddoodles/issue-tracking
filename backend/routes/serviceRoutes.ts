import express from "express";
import {
  addService,
  deleteService,
  getService,
  getServices,
  updateService,
} from "../controllers/serviceControllers.js";
import { isAdmin } from "../middleware/authMiddleware.ts";

const router = express.Router();

// @desc Create service
// @route POST /api/services/
// @access Private
router.post("/", addService);

// @desc Show all services
// @route GET /api/services/
// @access Public
router.get("/", getServices);

// @desc Show one service
// @route GET /api/services/:serviceId
// @access Public
router.get("/:serviceId", getService);

// @desc Update service
// @route PATCH /api/services/:serviceId
// @access Private
router.patch("/:serviceId", updateService);

// @desc Delete service
// @route DELETE /api/services/:serviceId
// @access Private
router.delete("/:serviceId", isAdmin, deleteService);

export default router;
