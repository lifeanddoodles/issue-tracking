import { Document } from "mongoose";

export enum Tier {
  FREE = "FREE",
  PRO = "PRO",
  ENTERPRISE = "ENTERPRISE",
}

export interface IServiceBase {
  name: string;
  description?: string;
  url?: string;
  version?: string;
  tier?: Tier;
}

export interface IServiceDocument extends IServiceBase, Document {}
