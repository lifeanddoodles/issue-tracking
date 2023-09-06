import { Document, ObjectId } from "mongoose";

export enum Priority {
  HIGH = "High",
  LOW = "Low",
  MEDIUM = "Medium",
}

export enum Status {
  IN_PROGRESS = "In progress",
  OPEN = "Open",
  CLOSED = "Closed",
}

export interface ITicket {
  title: string;
  description: string;
  assignee: ObjectId | Record<string, unknown> | string;
  reporter: ObjectId | Record<string, unknown> | string;
  status: Status;
  priority: Priority;
  moveToDevSprint: boolean;
  deadline: Date | string;
  isSubtask: boolean;
  parentTask: ObjectId | Record<string, unknown> | null;
  createdAt: Date | string;
  lastModifiedAt: Date | string;
}

export interface IEmployeeInfo {
  _id: string | ObjectId | Record<string, unknown>;
  firstName: string;
  lastName: string;
}

export type ITicketPopulatedDocument = ITicket & {
  _id: string | ObjectId | Record<string, unknown>;
} & {
  assignee: IEmployeeInfo;
  reporter: IEmployeeInfo;
};

export interface ITicketDocument extends ITicket, Document {}
