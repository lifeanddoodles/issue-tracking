import { Document, ObjectId, SchemaTimestampsConfig } from "mongoose";

export interface IComment {
  ticketId: ObjectId | Record<string, unknown> | string;
  author: ObjectId | Record<string, unknown> | string;
  message: string;
  isEdited: boolean;
}

export interface IAuthorInfo {
  _id: string | ObjectId | Record<string, unknown>;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface ICommentDocument
  extends IComment,
    Document,
    SchemaTimestampsConfig {}

export type ICommentPopulatedDocument = IComment & {
  _id: string | ObjectId | Record<string, unknown>;
} & {
  author: IAuthorInfo;
};
