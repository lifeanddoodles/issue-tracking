import {
  ITicketDocument,
  ITicketPopulatedDocument,
  Priority,
} from "shared/interfaces";
import TicketsTable from "../../components/TicketsTable";
import useFetch from "../../hooks/useFetch";
import { TICKETS_BASE_API_URL } from "../../routes";

enum TableColumns {
  title = "Title",
  status = "Status",
  ticketType = "Type",
  assignee = "Assignee",
  priority = "Priority",
  createdAt = "Created at",
}

const getColumnTitles = (ticket: {
  id: string;
  data: Partial<ITicketDocument>;
}) => {
  return Object.keys(ticket.data).map((key: string) => {
    return {
      key,
      title: TableColumns[key as keyof typeof TableColumns],
    };
  });
};

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
      <TicketsTable
        cols={getColumnTitles(formattedTickets[0])}
        rows={formattedTickets}
      />
    )
  );
};

export default AllTickets;
