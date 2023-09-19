/*
 * Auth
 */
export const AUTH_BASE_API_URL = "/api/auth";
export const GOOGLE_AUTH_BASE_API_URL = `${AUTH_BASE_API_URL}/google`;
export const GOOGLE_AUTH_CALLBACK_API_URL = `${GOOGLE_AUTH_BASE_API_URL}/callback`;

export const getLoginUserOptions = (userData: {
  email: string;
  password: string;
}) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(userData),
});

/*
 * Users
 */
export const USERS_BASE_API_URL = "/api/users";

export const getRegisterUserOptions = (userData: {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  position: string;
  password: string;
  confirmPassword: string;
}) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(userData),
});

/*
 * Tickets
 */
export const TICKETS_BASE_API_URL = "/api/tickets";

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

export const getDeleteCommentOptions = () => ({
  method: "DELETE",
});
