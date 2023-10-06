import {
  ITicketDocument,
  ITicketPopulatedDocument,
  Priority,
} from "shared/interfaces";
import TableFromDocuments from "../../components/TableFromDocuments";
import useFetch from "../../hooks/useFetch";
import { TICKETS_BASE_API_URL } from "../../routes";
import { getColumnTitles } from "../../utils";

enum TableColumns {
  title = "Title",
  status = "Status",
  ticketType = "Type",
  assignee = "Assignee",
  priority = "Priority",
  createdAt = "Created at",
}

const AllTickets = () => {
  const {
    data: tickets,
    loading,
    error,
  } = useFetch<ITicketDocument[] | ITicketPopulatedDocument[] | []>({
    url: TICKETS_BASE_API_URL,
  });
  const formattedTickets = tickets?.map((ticket) => {
    return {
      id: ticket._id.toString(),
      data: {
        title: ticket.title,
        status: ticket.status,
        ticketType: ticket.ticketType,
        assignee: ticket.assignee,
        priority: ticket.priority as Priority,
        createdAt: ticket.createdAt,
      },
    };
  });

  {
    loading && <h3 role="status">Loading tickets...</h3>;
  }
  {
    error && <h3 role="status">{error.message}</h3>;
  }
  {
    !loading && formattedTickets && formattedTickets?.length === 0 && (
      <h3 role="status">No tickets data found</h3>
    );
  }
  return (
    !loading &&
    formattedTickets &&
    formattedTickets?.length > 0 && (
      <TableFromDocuments
        cols={getColumnTitles(formattedTickets[0], TableColumns)}
        rows={formattedTickets}
        resourceBaseUrl="/dashboard/tickets"
      />
    )
  );
};

export default AllTickets;
