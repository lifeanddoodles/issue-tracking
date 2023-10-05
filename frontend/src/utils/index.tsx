import { ObjectId } from "mongoose";
import {
  DepartmentTeam,
  ITicketPopulatedDocument,
  IUser,
  IUserDocument,
  Priority,
  Status,
  TicketType,
  UserRole,
} from "../../../shared/interfaces";

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

export function paragraphsFromMultiLineText(text: string) {
  if (!text) return;
  return text
    .split("\n")
    .map((paragraph, index) => <p key={index}>{paragraph}</p>);
}

export function getOptionsFromEnum<E extends { [key: string]: string }>(
  enumName: E,
  getEnumTextFn: (value: string) => string
) {
  return Object.values(enumName).map((enumOption) => ({
    value: enumOption,
    label: getEnumTextFn(enumOption) || enumOption,
  }));
}

export function getStatusClasses(status: Status) {
  switch (status) {
    case Status.IN_PROGRESS:
      return "bg-blue-300";
    case Status.CLOSED:
      return "bg-green-400";
    case Status.OPEN:
    default:
      return "bg-red-400";
  }
}

export function getStatusText<Status>(status: Status): string {
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

export function getStatusOptions() {
  return getOptionsFromEnum(Status, getStatusText);
}

export function getPriorityClasses<Priority>(priority: Priority): string {
  switch (priority) {
    case Priority.HIGH:
      return "bg-red-400";
    case Priority.LOW:
      return "bg-gray-300";
    case Priority.MEDIUM:
    default:
      return "bg-yellow-400";
  }
}

export function getPriorityText<Priority>(enumName: Priority): string {
  switch (enumName) {
    case Priority.HIGH:
      return "High";
    case Priority.LOW:
      return "Low";
    case Priority.MEDIUM:
    default:
      return "Medium";
  }
}

export function getPriorityOptions() {
  return getOptionsFromEnum(Priority, getPriorityText);
}

export function getTicketTypeClasses<TicketType>(enumName: TicketType): string {
  switch (enumName) {
    case TicketType.BUG:
      return "bg-red-400";
    case TicketType.FEATURE_REQUEST:
      return "bg-orange-400";
    case TicketType.ISSUE:
    default:
      return "bg-gray-300";
  }
}

export function getTicketTypeText<TicketType>(enumName: TicketType): string {
  switch (enumName) {
    case TicketType.BUG:
      return "Bug";
    case TicketType.FEATURE_REQUEST:
      return "Feature";
    case TicketType.ISSUE:
    default:
      return "Issue";
  }
}

export function getTicketTypeOptions() {
  return getOptionsFromEnum(TicketType, getTicketTypeText);
}

export function getDepartmentTeamText<DepartmentTeam>(
  enumName: DepartmentTeam
): string {
  switch (enumName) {
    case DepartmentTeam.DEVELOPMENT:
      return "Development";
    case DepartmentTeam.TESTING:
      return "Testing";
    case DepartmentTeam.PRODUCT:
      return "Product";
    case DepartmentTeam.MANAGEMENT:
      return "Management";
    case DepartmentTeam.CUSTOMER_SUCCESS:
      return "Customer success";
    case DepartmentTeam.UNASSIGNED:
    default:
      return "Unassigned";
  }
}

export function getDepartmentTeamOptions() {
  const options = getOptionsFromEnum(DepartmentTeam, getDepartmentTeamText);
  return options.filter((item) => {
    return (
      item.value !== DepartmentTeam.MANAGEMENT &&
      item.value !== DepartmentTeam.CUSTOMER_SUCCESS
    );
  });
}

type FetchedData =
  | Partial<ITicketPopulatedDocument>[]
  | Partial<IUserDocument>[];

export function getUserDataOptions(users: FetchedData) {
  return users
    .filter(
      (user): user is Partial<IUserDocument> =>
        "role" in user && user?.role !== UserRole.CLIENT
    )
    .map((user) => ({
      value: user._id as string,
      label: getFullName(user.firstName!, user.lastName!),
    }));
}

export function getTicketDataOptions(tickets: FetchedData) {
  return tickets
    .filter(
      (ticket): ticket is Partial<ITicketPopulatedDocument> => "title" in ticket
    )
    .map((ticket) => ({
      value: ticket._id as string,
      label: ticket.title || (ticket._id as string),
    }));
}

export type ButtonVariant =
  | "accent"
  | "primary"
  | "secondary"
  | "transparent"
  | "icon"
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
    case "icon":
      return "text-primary hover:bg-neutral-200 py-1 px-1 w-8 h-8";
    case "link":
      return "text-primary hover:text-primary-dark hover:underline";
  }
}
