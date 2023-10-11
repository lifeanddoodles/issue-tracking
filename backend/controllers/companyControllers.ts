import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { RootQuerySelector } from "mongoose";
import {
  ICompany,
  ICompanyDocument,
  IUserDocument,
  SubscriptionStatus,
  UserRole,
} from "../../shared/interfaces/index.js";
import Company from "../models/companyModel.js";
import {
  getEmployees,
  idIsInIdsArray,
  isAlreadyListedAsEmployeeInACompany,
} from "../utils/index.ts";

const authorizeCompanyUpdate = async (req: Request, res: Response) => {
  const companyId = req.params.companyId;

  const authUser: Partial<IUserDocument> | undefined = req.user;
  const authUserId = authUser?._id.toString();
  const isAdmin = authUser?.role === UserRole.ADMIN;

  const newEmployeeId = req?.body?.employeeId || authUserId;

  // Find company
  const company = await Company.findById(companyId);

  // Handle company not found
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  const authUserIsEmployee = idIsInIdsArray(company.employees, authUserId);

  // Handle authenticated user not authorized for request
  if (!isAdmin && !authUserIsEmployee) {
    return false;
  }

  // Handle if request is not authorized because new employee
  // is listed as an employee of an existing company
  const alreadyListedAsEmployeeInACompany =
    await isAlreadyListedAsEmployeeInACompany(newEmployeeId);

  if (alreadyListedAsEmployeeInACompany) {
    return false;
  }

  return true;
};

// @desc Create company
// @route POST /api/companies/
// @access Private
export const addCompany = asyncHandler(async (req: Request, res: Response) => {
  // Get authenticated user
  const authUser: Partial<IUserDocument> | undefined = req.user;
  const authUserId = authUser?._id.toString();
  const isAdmin = authUser?.role === UserRole.ADMIN;
  const isClient = authUser?.role === UserRole.CLIENT;

  // Prepare request variables (body, params, user, etc.)
  const newCompanyDataBody = req.body;

  // Handle if user is not authorized for request,
  // because they are already in an existing company as employee
  const companiesWithAuthUserAsEmployee = await Company.find({
    employees: { $in: authUserId },
  });

  if (authUser && !isAdmin && companiesWithAuthUserAsEmployee.length > 0) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  // Handle request with missing fields
  const missingFields = !newCompanyDataBody.name;

  if (missingFields) {
    res.status(400);
    throw new Error("Please add all required fields");
  }

  // Prepare new company data
  const newCompanyData: Partial<ICompany> = {
    ...newCompanyDataBody,
    subscriptionStatus: SubscriptionStatus.TRIAL,
    employees: isClient
      ? getEmployees(newCompanyDataBody.employees, authUserId)
      : newCompanyDataBody.employees,
  };

  // Request company creation
  const newCompany: ICompanyDocument = await Company.create(newCompanyData);

  // Handle company creation error
  if (!newCompany) {
    res.status(400);
    throw new Error("Company not created");
  }

  // Handle success
  res.status(201).send(newCompany);
});

// @desc Get all companies
// @route GET /api/companies/
// @access Private
export const getCompanies = asyncHandler(
  async (req: Request, res: Response) => {
    // Validation
    // Get authenticated user
    const authUser: Partial<IUserDocument> | undefined = req.user;
    const isClient = authUser?.role === UserRole.CLIENT;

    // Handle if user is not authorized for request
    if (isClient) {
      res.status(401);
      throw new Error("Not Authorized");
    }

    // Find companies
    const query: RootQuerySelector<ICompanyDocument> = {};

    for (const key in req.query) {
      query[key as keyof ICompanyDocument] = req.query[key];
    }
    const companies: ICompanyDocument[] = await Company.find(query);

    // Handle companies not found
    if (!companies) {
      res.status(404);
      throw new Error("Companies not found");
    }

    // Handle success
    res.status(200).send(companies);
  }
);

// @desc  Get one company
// @route GET /api/companies/:companyId
// @access Private
export const getCompany = asyncHandler(async (req: Request, res: Response) => {
  // Validation
  // Get authenticated user
  const authUser: Partial<IUserDocument> | undefined = req.user;
  const isClient = authUser?.role === UserRole.CLIENT;

  // Handle if user is not authorized for request
  if (isClient) {
    res.status(401);
    throw new Error("Not Authorized");
  }

  // Prepare request variables (body, params, user, etc.)
  const companyId = req.params.companyId;

  // Find company
  const company = await Company.findById(companyId);

  // Handle company not found
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  // Handle success
  res.status(200).send(company);
});

// @desc Update company
// @route PATCH /api/companies/:companyId
// @access Private
export const updateCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const companyId = req.params.companyId;
    const authUser: Partial<IUserDocument> | undefined = req.user;
    const newEmployeeId = req.body.employeeId;

    // Prepare updated company data
    const updatedCompanyData = req.body;

    // Request company update
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      {
        ...updatedCompanyData,
        employees: getEmployees(updatedCompanyData.employees, newEmployeeId),
      },
      {
        user: authUser,
        employeeId: newEmployeeId,
        new: true,
      }
    );

    // Handle company update error
    if (!updatedCompany) {
      res.status(400);
      throw new Error("Company not updated");
    }

    // Handle success
    res.status(200).send(updatedCompany);
  }
);

// @desc Delete company
// @route DELETE /api/companies/:companyId
// @access Private
export const deleteCompany = asyncHandler(
  async (req: Request, res: Response) => {
    // Prepare request variables (body, params, user, etc.)
    const companyId = req.params.companyId;

    // Find company
    const company = await Company.findById(companyId);

    // Handle company not found
    if (!company) {
      res.status(404);
      throw new Error("Company not found");
    }

    // Validation
    // Get authenticated user
    const authUser: Partial<IUserDocument> | undefined = req.user;
    const authUserId = authUser?._id.toString();
    const isClient = authUser?.role === UserRole.CLIENT;

    // Handle authenticated user not authorized for request
    const authUserIsEmployee = idIsInIdsArray(company.employees, authUserId);

    if (isClient && !authUserIsEmployee) {
      res.status(401);
      throw new Error("Not Authorized");
    }

    // Request company deletion
    const deletedCompany = await Company.deleteOne({ _id: companyId });

    // Handle company not found
    if (!deletedCompany) {
      res.status(404);
      throw new Error("Company not deleted");
    }

    // Handle success
    res.status(200).json({ message: "Company deleted successfully" });
  }
);

// @desc Create company
// @route PATCH /api/companies/employees
// @access Private
export const addEmployee = asyncHandler(async (req: Request, res: Response) => {
  const companyId = req.params.companyId;
  const newEmployeeId = req.body.employeeId;

  // Get authenticated user
  const authUser: Partial<IUserDocument> | undefined = req.user;

  // Find company
  const company = await Company.findById(companyId);

  // Handle company not found
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  // Request company update
  const updatedCompany = await Company.findByIdAndUpdate(
    companyId,
    {
      employees: getEmployees(company.employees, newEmployeeId),
    },
    {
      user: authUser,
      employeeId: newEmployeeId,
      new: true,
    }
  );

  // Handle company update error
  if (!updatedCompany) {
    res.status(400);
    throw new Error("Company not updated");
  }

  // Handle success
  res.status(200).send(updatedCompany);
});
