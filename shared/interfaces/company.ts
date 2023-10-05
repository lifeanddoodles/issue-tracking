import { Document, ObjectId } from "mongoose";

export enum Industry {
  HEALTHCARE = "HEALTHCARE",
  EDUCATION = "EDUCATION",
  FINANCE = "FINANCE",
  E_COMMERCE = "E_COMMERCE",
  MANUFACTURING = "MANUFACTURING",
  HOSPITALITY = "HOSPITALITY",
  UNASSIGNED = "UNASSIGNED",
}

export enum SubscriptionStatus {
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
  url: string;
  subscriptionStatus: SubscriptionStatus;
  email?: string;
  phone?: string;
  address?: IAddressInfo;
  employees: (ObjectId | Record<string, unknown>)[];
  projects?: (ObjectId | Record<string, unknown>)[];
  dba?: string;
  description?: string;
  industry?: Industry;
}

export interface ICompanyDocument extends ICompany, Document {}
