import {
  ITicket,
  ITicketBase,
  ITicketPopulatedDocument,
  IUser,
} from "../../../shared/interfaces";

/*
 * Auth
 */
export const AUTH_BASE_API_URL = "/api/auth";
export const LOGIN_API_URL = `${AUTH_BASE_API_URL}/login`;
export const LOGOUT_API_URL = `${AUTH_BASE_API_URL}/logout`;
export const GOOGLE_AUTH_BASE_API_URL = `${AUTH_BASE_API_URL}/google`;
export const GOOGLE_AUTH_CALLBACK_API_URL = `${GOOGLE_AUTH_BASE_API_URL}/callback`;

export const getLoginUserOptions = (reqBody: {
  email: string;
  password: string;
}) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(reqBody),
});

/*
 * Users
 */
export const USERS_BASE_API_URL = "/api/users";
export const PROFILE_API_URL = `${USERS_BASE_API_URL}/profile`;

export const getRegisterUserOptions = (reqBody: {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  position: string;
  password: string;
  confirmPassword: string;
}) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(reqBody),
});

export const getUpdateUserOptions = (reqBody: Partial<IUser>) => ({
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(reqBody),
});

/*
 * Tickets
 */
export const TICKETS_BASE_API_URL = "/api/tickets";
export const TICKET_BY_ID_API_URL = `${TICKETS_BASE_API_URL}/:ticketId`;

export const getPostTicketOptions = (
  reqBody: ITicketBase | ITicket | Partial<ITicketPopulatedDocument>
) => ({
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(reqBody),
});

/*
 * Comments
 */
export const COMMENTS_BASE_API_URL = "/api/comments";

export const getUpdateCommentOptions = (message: string) => ({
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ message }),
});

export const getDeleteOptions = () => ({
  method: "DELETE",
});

/*
 * Companies
 */
export const COMPANIES_BASE_API_URL = "/api/companies";

/*
 * Projects
 */
export const PROJECTS_BASE_API_URL = "/api/projects";

/*
 * Services
 */
export const SERVICES_BASE_API_URL = "/api/services";

export const getPostOptions: <T>(reqBody: Partial<T>) => RequestInit = (
  reqBody
) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(reqBody),
});

export const getUpdateOptions: <T>(reqBody: Partial<T>) => RequestInit = (
  reqBody
) => ({
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(reqBody),
});
