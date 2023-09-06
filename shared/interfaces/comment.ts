import { Document, ObjectId } from "mongoose";

export interface IComment {
  ticketId: ObjectId | Record<string, unknown> | string;
  author: ObjectId | Record<string, unknown> | string;
  message: string;
  isEdited: boolean;
  createdAt?: Date | string;
  lastModifiedAt?: Date | string;
}

export interface ICommentDocument extends IComment, Document {}
