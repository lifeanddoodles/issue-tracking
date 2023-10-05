import { Document, ObjectId } from "mongoose";

export interface IProjectBase {
  name: string;
  url?: string;
  description?: string;
  company: ObjectId | Record<string, unknown>;
  services?: (ObjectId | Record<string, unknown>)[];
  team: (ObjectId | Record<string, unknown>)[];
  tickets?: (ObjectId | Record<string, unknown>)[];
}

export interface IProjectDocument extends IProjectBase, Document {}
