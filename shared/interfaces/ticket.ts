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
  assignee: ObjectId | Record<string, unknown>;
  reporter: ObjectId | Record<string, unknown>;
  status: Status;
  priority: Priority;
  moveToDevSprint: boolean;
  deadline: Date;
  isSubtask: boolean;
  parentTask: ObjectId | Record<string, unknown> | null;
  createdAt: Date;
  lastModifiedAt: Date;
}

export interface ITicketDocument extends ITicket, Document {}
