import {
  Document,
  ObjectId,
  RootQuerySelector,
  SchemaTimestampsConfig,
} from "mongoose";

export enum Priority {
  HIGH = "HIGH",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
}

export enum Status {
  IN_PROGRESS = "IN_PROGRESS",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export enum TicketType {
  ISSUE = "ISSUE",
  BUG = "BUG",
  FEATURE_REQUEST = "FEATURE_REQUEST",
  FOLLOW_UP = "FOLLOW_UP",
}

export enum DepartmentTeam {
  DEVELOPMENT = "DEVELOPMENT",
  QUALITY_ASSURANCE = "QUALITY_ASSURANCE",
  PRODUCT = "PRODUCT",
  CUSTOMER_SUCCESS = "CUSTOMER_SUCCESS",
  MANAGEMENT = "MANAGEMENT",
}

export interface IPersonInfo {
  _id: string | ObjectId | Record<string, unknown>;
  firstName: string;
  lastName: string;
}

export interface ITicketBase {
  title: string;
  description: string;
  attachments?: string[];
  externalReporter?: ObjectId | Record<string, unknown> | string;
}

export interface ITicket extends ITicketBase {
  assignee?: ObjectId | Record<string, unknown> | string;
  reporter?: ObjectId | Record<string, unknown> | string;
  status: Status;
  priority: Priority;
  assignToTeam: DepartmentTeam;
  ticketType: TicketType;
  estimatedTime?: number;
  deadline?: Date | string;
  isSubtask: boolean;
  parentTask?: ObjectId | Record<string, unknown> | string;
}

export type ITicketAggregations = {
  projectInfo?: {
    _id: string | ObjectId | Record<string, unknown>;
    name: string;
    company: {
      _id: string | ObjectId | Record<string, unknown>;
      name: string;
      employees: [IPersonInfo];
    };
  };
  serviceInfo?: {
    _id: string | ObjectId | Record<string, unknown>;
    name: string;
  };
};

export interface ITicketDocument
  extends ITicket,
    Document,
    SchemaTimestampsConfig,
    ITicketAggregations {}

export type ITicketWithStatics = ITicketDocument & {
  aggregateTicketsWithProjectsAndServices?(
    query: RootQuerySelector<ITicketDocument>
  ): Promise<any[]>;
};

export type ITicketPopulatedDocument = ITicketDocument & {
  assignee: IPersonInfo;
  reporter: IPersonInfo;
  externalReporter: IPersonInfo;
};
