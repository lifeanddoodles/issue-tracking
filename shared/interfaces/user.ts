import { Document } from "mongoose";

export enum UserRole {
  CLIENT = "CLIENT",
  STAFF = "STAFF",
  DEVELOPER = "DEVELOPER",
  ADMIN = "ADMIN",
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: UserRole | string;
  company: string;
  position: string;
  avatarUrl?: string;
  createdAt?: Date | string;
  lastModifiedAt?: Date | string;
}

export interface IUserDocument extends IUser, Document {}
