import { Document, ObjectId } from "mongoose";

export interface IComment {
  ticketId: ObjectId | Record<string, unknown> | string;
  author: ObjectId | Record<string, unknown> | string;
  message: string;
  isEdited: boolean;
  createdAt: Date | string;
  lastModifiedAt?: Date | string;
}

export interface IAuthorInfo {
  _id: string | ObjectId | Record<string, unknown>;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface ICommentDocument extends IComment, Document {}

export type ICommentPopulatedDocument = IComment & {
  _id: string | ObjectId | Record<string, unknown>;
} & {
  author: IAuthorInfo;
};
