import { ObjectId } from "mongoose";
import Company from "../models/companyModel.js";

export function addDays(date: Date, days: number) {
  date.setDate(date.getDate() + days);
  return date;
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export const getEmployees = (
  employees: (ObjectId | Record<string, unknown> | string)[],
  newEmployeeId: ObjectId | Record<string, unknown> | string
) => {
  if (!employees && !newEmployeeId) {
    return [];
  }
  if (!employees && newEmployeeId) {
    return [newEmployeeId];
  }
  if (employees && !newEmployeeId) {
    return [...employees];
  }
  const employeesSet = new Set([
    ...(employees !== undefined && employees !== null ? employees : []),
    newEmployeeId,
  ]);
  return employeesSet ? [...employeesSet] : [];
};

export const idIsInIdsArray = (
  array: (ObjectId | Record<string, unknown> | string)[],
  id: ObjectId | Record<string, unknown> | string
) => {
  if (!array.length || array.length === 0) {
    return false;
  }
  return array.includes(id);
};

export const isAlreadyListedAsEmployeeInACompany = async (
  potentialEmployeeId: string
) => {
  const listedAsEmployeeInACompany = await Company.find({
    employees: { $in: potentialEmployeeId },
  });

  if (listedAsEmployeeInACompany.length > 0) {
    return true;
  }
  return false;
};
