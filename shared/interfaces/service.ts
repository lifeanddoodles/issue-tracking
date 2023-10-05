import { Document } from "mongoose";

export interface IServiceBase {
  name: string;
  description?: string;
  url?: string;
  version?: string;
  tier?: string;
}

export interface IServiceDocument extends IServiceBase, Document {}
