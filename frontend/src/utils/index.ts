import { ObjectId } from "mongoose";
import { IUser, Status } from "../../../shared/interfaces";

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

export function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
}

export function getFullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`;
}

export function getStatusText(status: Status): string {
  switch (status) {
    case Status.IN_PROGRESS:
      return "In progress";
    case Status.CLOSED:
      return "Closed";
    case Status.OPEN:
    default:
      return "Open";
  }
}

export type ButtonVariant =
  | "accent"
  | "primary"
  | "secondary"
  | "transparent"
  | "link";

export function getVariantClasses(variant: ButtonVariant) {
  switch (variant) {
    case "accent":
      return "text-white bg-accent hover:bg-accent-dark py-1 px-3";
    case "primary":
      return "text-white bg-primary hover:bg-primary-dark py-1 px-3";
    case "secondary":
      return "text-white bg-secondary hover:bg-secondary-dark py-1 px-3";
    case "transparent":
      return "text-primary hover:bg-neutral-200 py-2 px-3";
    case "link":
      return "text-primary hover:text-primary-dark hover:underline";
  }
}
