import { Document, ObjectId } from "mongoose";

export enum Priority {
  High = "HIGH",
  Low = "LOW",
  Medium = "MEDIUM",
}

export enum Status {
  InProgress = "IN_PROGRESS",
  Open = "OPEN",
  Closed = "CLOSED",
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

export interface ITicketDocument extends ITicket, Document {}
