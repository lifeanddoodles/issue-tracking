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
