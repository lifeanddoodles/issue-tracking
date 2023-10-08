import { Document } from "mongoose";
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
  company: string;
  position?: string;
  department?: DepartmentTeam;
  avatarUrl?: string;
}

export interface IUserDocument extends IUser, Document {
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}
