import { Document, ObjectId, SchemaTimestampsConfig } from "mongoose";

export interface IProjectBase {
  name: string;
  company: ObjectId | Record<string, unknown> | string;
  team?: (ObjectId | Record<string, unknown> | string)[];
  url?: string;
  description?: string;
  services?: (ObjectId | Record<string, unknown> | string)[];
  tickets?: (ObjectId | Record<string, unknown> | string)[];
}

export interface IProjectDocument
  extends IProjectBase,
    Document,
    SchemaTimestampsConfig {}
