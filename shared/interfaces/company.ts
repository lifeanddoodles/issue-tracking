import { Document, Model, ObjectId, SchemaTimestampsConfig } from "mongoose";
import { Tier } from "./service.js";

export enum Industry {
  HEALTHCARE = "HEALTHCARE",
  EDUCATION = "EDUCATION",
  FINANCE = "FINANCE",
  E_COMMERCE = "E_COMMERCE",
  MANUFACTURING = "MANUFACTURING",
  HOSPITALITY = "HOSPITALITY",
}

export enum SubscriptionStatus {
  TRIAL = "TRIAL",
  ONBOARDING = "ONBOARDING",
  ACTIVE = "ACTIVE",
  PENDING_DOWNGRADE = "PENDING_DOWNGRADE",
  DOWNGRADING = "DOWNGRADING",
  PENDING_UPGRADE = "PENDING_UPGRADE",
  UPGRADING = "UPGRADING",
  PENDING_RENEWAL = "PENDING_RENEWAL",
  PENDING_CANCELATION = "PENDING_CANCELLATION",
  CANCELLED = "CANCELLED",
  CHURNED = "CHURNED",
}

export interface IAddressInfo {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface ICompany {
  name: string;
  url?: string;
  subscriptionStatus: SubscriptionStatus;
  email?: string;
  phone?: string;
  address?: IAddressInfo;
  employees: (ObjectId | Record<string, unknown> | string)[];
  projects?: (ObjectId | Record<string, unknown> | string)[];
  dba?: string;
  description?: string;
  industry?: Industry;
  tier: Tier;
  assignedRepresentative?: ObjectId | Record<string, unknown> | string;
}

export interface ICompanyDocument
  extends ICompany,
    Document,
    SchemaTimestampsConfig {}

export interface ICompanyWithStatics extends Model<ICompanyDocument> {
  getTicketsByCompany(companyId?: string): Promise<any[]>;
}
