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
import User from "../models/userModel.js";
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

  // Add account to assigned representative
  if (newCompany.assignedRepresentative) {
    const userToAssignAsRepresentative = await User.findById(
      newCompany?.assignedRepresentative
    ).select("department assignedAccounts");

    userToAssignAsRepresentative?.assignedAccounts?.push(newCompany._id);

    await userToAssignAsRepresentative?.save({
      validateBeforeSave: true,
    });
  }

  // Handle success
  res.status(201).send(newCompany);
});

// @desc Get all companies
// @route GET /api/companies/
// @access Private
export const getCompanies = asyncHandler(
  async (req: Request, res: Response) => {
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

    const companies: ICompanyDocument[] = await Company.find(query)
      .populate({
        path: "projects",
        select: "name",
      })
      .populate({
        path: "employees",
        select: "firstName lastName -company",
      });

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
  const company = await Company.findById(companyId)
    .populate({
      path: "projects",
      select: "name",
    })
    .populate({
      path: "employees",
      select: "firstName lastName -company",
    });

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

    // Find company
    const updatedCompany = await Company.findById(companyId);

    // Handle company not found
    if (!updatedCompany) {
      res.status(400);
      throw new Error("Company not found");
    }

    // Update company
    updatedCompany.set({
      ...updatedCompanyData,
      ...(newEmployeeId
        ? {
            employees: Array.from(
              new Set([...(updatedCompanyData.employees || []), newEmployeeId])
            ),
          }
        : {}),
    });

    // Save updates to company
    await updatedCompany.save({
      validateBeforeSave: true,
    });

    // Add account to assigned representative
    if (updatedCompanyData?.assignedRepresentative) {
      const userToAssignAsRepresentative = await User.findById(
        updatedCompanyData?.assignedRepresentative
      ).select("department assignedAccounts");

      userToAssignAsRepresentative?.assignedAccounts?.push(companyId!);

      await userToAssignAsRepresentative?.save({
        validateBeforeSave: true,
      });
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

// @desc Get company employees
// @route GET /api/companies/employees
// @access Private
export const getCompanyEmployees = asyncHandler(
  async (req: Request, res: Response) => {
    const companyId = req.params.companyId;

    // Get authenticated user
    const authUser: Partial<IUserDocument> | undefined = req.user;

    // Find company
    const employees = await Company.findById(companyId)
      .select("employees")
      .populate("employees", "_id firstName lastName position");

    // Handle company not found
    if (!employees) {
      res.status(404);
      throw new Error("Company not found");
    }

    // Handle success
    res.status(200).send(employees);
  }
);

// @desc Create new employee
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

// @desc Show user's company
// @route GET /api/companies/:userId
// @access Private
export const getUserCompany = asyncHandler(
  async (req: Request, res: Response) => {
    // Prepare request variables (body, params, user, etc.)
    const reqUser = req?.user as Partial<IUserDocument>;
    const authUserId = reqUser._id;

    // Find user in database
    const company = await Company.find({ employees: { $in: authUserId } });

    // Handle user not found
    if (!company) {
      res.status(404);
      throw new Error("Company not found");
    }

    // Handle success
    res.status(200).send(company);
  }
);
