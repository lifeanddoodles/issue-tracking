/*
 * Tickets
 */
export const getTickets = async () => {
  const response = await fetch("/api/tickets");
  const data = await response.json();
  return data;
};

export const getTicketInfo = async (ticketId: string) => {
  const response = await fetch(`/api/tickets/${ticketId}`);
  const data = await response.json();
  return data;
};

/*
 * Comments
 */
export const updateComment = async (commentId: string, message: string) => {
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });
  const data = await response.json();
  return data;
};

export const deleteComment = async (commentId: string) => {
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
};
