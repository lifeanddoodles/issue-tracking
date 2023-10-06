import express from "express";
import {
  addCompany,
  addEmployee,
  deleteCompany,
  getCompanies,
  getCompany,
  updateCompany,
} from "../controllers/companyControllers.js";

const router = express.Router();

// CREATE
// @desc Create company
// @route POST /api/companies/
// @access Private
router.post("/", addCompany);

// READ
// @desc Get all companies
// @route GET /api/companies/
// @access Private
router.get("/", getCompanies);

// @desc Get one company by ID
// @route GET /api/companies/:companyId
// @access Public
router.get("/:companyId", getCompany);

// @desc Update company
// @route PATCH /api/companies/:companyId
// @access Private
router.patch("/:companyId", updateCompany);

// @desc Delete company
// @route DELETE /api/companies/:companyId
// @access Private
router.delete("/:companyId", deleteCompany);

// @desc Add employee to company
// @route PATCH /api/companies/:companyId/employees
// @access Private
router.patch("/:companyId/employees", addEmployee);

export default router;
