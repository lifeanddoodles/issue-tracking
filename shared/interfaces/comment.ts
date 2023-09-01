import { Document, ObjectId } from "mongoose";

export interface IComment {
  ticketId: ObjectId | Record<string, unknown>;
  author: string;
  message: string;
  isEdited: boolean;
  createdAt: Date;
  lastModifiedAt: Date;
}

export interface ICommentDocument extends IComment, Document {}
