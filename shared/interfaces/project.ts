import { Document, ObjectId } from "mongoose";

export interface IProjectBase {
  name: string;
  company: ObjectId | Record<string, unknown>;
  team: (ObjectId | Record<string, unknown>)[];
  url?: string;
  description?: string;
  services?: (ObjectId | Record<string, unknown>)[];
  tickets?: (ObjectId | Record<string, unknown>)[];
}

export interface IProjectDocument extends IProjectBase, Document {}
