import { Document, ObjectId } from "mongoose";
import { DepartmentTeam } from "./ticket.ts";

export enum UserRole {
  CLIENT = "CLIENT",
  STAFF = "STAFF",
  DEVELOPER = "DEVELOPER",
  ADMIN = "ADMIN",
}

export interface IUser {
  username?: string;
  googleId?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: UserRole | string;
  company?: ObjectId | Record<string, unknown> | string;
  position?: string;
  department?: DepartmentTeam;
  avatarUrl?: string;
  assignedAccounts?: (ObjectId | Record<string, unknown> | string)[];
}

export interface IUserDocument extends IUser, Document {
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}
