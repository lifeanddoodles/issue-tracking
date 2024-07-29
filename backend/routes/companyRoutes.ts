import express from "express";
import {
  addCompany,
  addEmployee,
  deleteCompany,
  getCompanies,
  getCompany,
  getCompanyEmployees,
  updateCompany,
} from "../controllers/companyControllers.js";
import { ensureAuth, isAdmin } from "../middleware/authMiddleware.ts";
import formatResults from "../middleware/formatResults.ts";
import Company from "../models/companyModel.ts";

const router = express.Router();

// CREATE
// @desc Create company
// @route POST /api/companies/
// @access Public
router.post("/", addCompany);

// READ
// @desc Get all companies
// @route GET /api/companies/
// @access Private
router.get(
  "/",
  ensureAuth,
  formatResults(Company, [
    {
      path: "projects",
      select: "name",
    },
    {
      path: "employees",
      select: "firstName lastName -company",
    },
  ]),
  getCompanies
);

// @desc Get one company by ID
// @route GET /api/companies/:companyId
// @access Public
router.get("/:companyId", getCompany);

// @desc Update company
// @route PATCH /api/companies/:companyId
// @access Private
router.patch("/:companyId", ensureAuth, updateCompany);

// @desc Delete company
// @route DELETE /api/companies/:companyId
// @access Private
router.delete("/:companyId", ensureAuth, isAdmin, deleteCompany);

// @desc Get company employees
// @route GET /api/companies/:companyId/employees
// @access Private
router.get("/:companyId/employees", ensureAuth, getCompanyEmployees);

// @desc Add employee to company
// @route PATCH /api/companies/:companyId/employees
// @access Private
router.patch("/:companyId/employees", ensureAuth, isAdmin, addEmployee);

export default router;
