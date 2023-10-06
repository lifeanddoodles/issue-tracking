import { ObjectId } from "mongoose";
import Company from "../models/companyModel.js";

export const getEmployees = (
  employees: (ObjectId | Record<string, unknown>)[],
  authUserId: ObjectId | Record<string, unknown>
) => {
  const employeesSet = new Set([...(employees || []), authUserId]);
  return [...employeesSet];
};

export const idIsInIdsArray = (
  array: (ObjectId | Record<string, unknown>)[],
  id: ObjectId | Record<string, unknown>
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
