import { ObjectId } from "mongoose";
import { IUser } from "../../../shared/interfaces";

export const getAuthorInfo: (
  author: string | ObjectId | Record<string, unknown>
) => Promise<
  IUser & { _id: string | ObjectId | Record<string, unknown> }
> = async (author) => {
  try {
    const authorId = typeof author !== "string" ? author!.toString() : author;

    const response = await fetch(`/api/users/${authorId}`, { mode: "cors" });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const authorInfo = await response.json();

    return authorInfo;
  } catch (error) {
    console.error("Error:", error);
  }
};
