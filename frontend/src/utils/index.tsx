import { ObjectId } from "mongoose";
import {
  DepartmentTeam,
  ICompanyDocument,
  ITicketPopulatedDocument,
  IUser,
  IUserDocument,
  Industry,
  Priority,
  Status,
  SubscriptionStatus,
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
  getEnumTextFn: (value: string) => string,
  noSelectionText?: string
) {
  const enumOptions = Object.values(enumName).map((enumOption) => ({
    value: enumOption,
    label: getEnumTextFn(enumOption) || enumOption,
  }));
  const emptyOption = {
    value: "",
    label: noSelectionText || "Select option",
  };

  return [emptyOption, ...enumOptions];
}

export function getStatusClasses(status: Status | SubscriptionStatus) {
  switch (status) {
    case Status.IN_PROGRESS:
    case SubscriptionStatus.ACTIVE:
    case SubscriptionStatus.ONBOARDING:
    case SubscriptionStatus.PENDING_RENEWAL:
      return "bg-blue-300";
    case Status.CLOSED:
    case SubscriptionStatus.PENDING_UPGRADE:
    case SubscriptionStatus.UPGRADING:
      return "bg-green-400";
    case SubscriptionStatus.DOWNGRADING:
    case SubscriptionStatus.PENDING_CANCELATION:
    case SubscriptionStatus.PENDING_DOWNGRADE:
      return "bg-orange-400";
    case Status.OPEN:
    case SubscriptionStatus.CANCELLED:
    case SubscriptionStatus.CHURNED:
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

export function getStatusOptions(noSelectionText?: string) {
  return getOptionsFromEnum(Status, getStatusText, noSelectionText);
}

export function getSubscriptionStatusText<SubscriptionStatus>(
  status: SubscriptionStatus
): string {
  switch (status) {
    case SubscriptionStatus.ACTIVE:
      return "Active";
    case SubscriptionStatus.PENDING_RENEWAL:
      return "Pending renewal";
    case SubscriptionStatus.PENDING_UPGRADE:
      return "Pending upgrade";
    case SubscriptionStatus.UPGRADING:
      return "Upgrading";
    case SubscriptionStatus.DOWNGRADING:
      return "Downgrading";
    case SubscriptionStatus.PENDING_CANCELATION:
      return "Pending cancellation";
    case SubscriptionStatus.PENDING_DOWNGRADE:
      return "Pending downgrade";
    case SubscriptionStatus.CANCELLED:
      return "Cancelled";
    case SubscriptionStatus.CHURNED:
      return "Churned";
    case SubscriptionStatus.ONBOARDING:
      return "Onboarding";
    case SubscriptionStatus.TRIAL:
      return "Trial";
    default:
      return "Unassigned";
  }
}

export function getSubscriptionStatusOptions(noSelectionText?: string) {
  return getOptionsFromEnum(
    SubscriptionStatus,
    getSubscriptionStatusText,
    noSelectionText
  );
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

export function getPriorityOptions(noSelectionText?: string) {
  return getOptionsFromEnum(Priority, getPriorityText, noSelectionText);
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

export function getTicketTypeOptions(noSelectionText?: string) {
  return getOptionsFromEnum(TicketType, getTicketTypeText, noSelectionText);
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
    default:
      return "Unassigned";
  }
}

export function getDepartmentTeamOptions(noSelectionText?: string) {
  const options = getOptionsFromEnum(
    DepartmentTeam,
    getDepartmentTeamText,
    noSelectionText
  );
  return options;
}

export function getIndustryText<Industry>(enumName: Industry): string {
  switch (enumName) {
    case Industry.HEALTHCARE:
      return "Healthcare";
    case Industry.EDUCATION:
      return "Education";
    case Industry.FINANCE:
      return "Finance";
    case Industry.E_COMMERCE:
      return "E-commerce";
    case Industry.MANUFACTURING:
      return "Manufacturing";
    case Industry.HOSPITALITY:
      return "Hospitality";
    default:
      return "Unassigned";
  }
}

export function getIndustryOptions(noSelectionText?: string) {
  const options = getOptionsFromEnum(
    Industry,
    getIndustryText,
    noSelectionText
  );
  return options;
}

export function getUserRoleText<UserRole>(enumName: UserRole): string {
  switch (enumName) {
    case UserRole.ADMIN:
      return "Admin";
    case UserRole.DEVELOPER:
      return "Developer";
    case UserRole.STAFF:
      return "Staff";
    case UserRole.CLIENT:
      return "Client";
    default:
      return "Unassigned";
  }
}

export function getUserRoleOptions(noSelectionText?: string) {
  const options = getOptionsFromEnum(
    UserRole,
    getUserRoleText,
    noSelectionText
  );
  return options;
}

export function getAssignableDepartmentTeamOptions(noSelectionText?: string) {
  const options = getOptionsFromEnum(
    DepartmentTeam,
    getDepartmentTeamText,
    noSelectionText
  );
  return options.filter((item) => {
    return (
      item.value !== DepartmentTeam.MANAGEMENT &&
      item.value !== DepartmentTeam.CUSTOMER_SUCCESS
    );
  });
}

type FetchedData =
  | Partial<ITicketPopulatedDocument>[]
  | Partial<IUserDocument>[]
  | Partial<ICompanyDocument>[];

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

export function getClientDataOptions(users: FetchedData) {
  return users
    .filter(
      (user): user is Partial<IUserDocument> =>
        "role" in user && user?.role === UserRole.CLIENT
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

export function getCompanyDataOptions(companies: FetchedData) {
  return companies
    .filter(
      (company): company is Partial<ICompanyDocument> => "name" in company
    )
    .map((company) => ({
      value: company._id as string,
      label: company.name || (company._id as string),
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

export const getColumnTitles: <T>(
  row: { id: string; data: Partial<T> },
  columnsEnum: Record<string, string>
) => { keyTitle: string; title: string }[] = (row, columnsEnum) => {
  return Object.keys(row.data).map((keyTitle: string) => {
    return {
      keyTitle,
      title: columnsEnum[keyTitle],
    };
  });
};

export const objectToQueryString: <
  T extends Record<string, string | number | boolean>
>(
  obj: Partial<T>
) => string = (obj) => {
  const queryParams: string[] = [];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value !== "undefined") {
        queryParams.push(
          encodeURIComponent(key) + "=" + encodeURIComponent(String(value))
        );
      }
    }
  }

  return queryParams.join("&");
};

export function shallowEqual<T extends Record<string, unknown> | undefined>(
  objA: T,
  objB: T
): boolean {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== "object" || typeof objB !== "object" || !objA || !objB) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    if (objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}
