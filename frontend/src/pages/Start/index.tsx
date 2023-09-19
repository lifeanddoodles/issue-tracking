import { ITicket, ITicketPopulatedDocument } from "shared/interfaces";
import Heading from "../../components/Heading";
import TicketsList from "../../components/TicketsList";
import useFetch from "../../hooks/useFetch";
import { TICKETS_BASE_API_URL } from "../../routes";

const Start = () => {
  const {
    data: tickets,
    loading: loadingTickets,
    error,
  } = useFetch<(ITicket & { _id: string })[] | ITicketPopulatedDocument[] | []>(
    { url: TICKETS_BASE_API_URL }
  );

  return (
    <>
      <Heading text="Dashboard" level={1} />
      <Heading text="Notifications" />
      <Heading text="Tickets" />
      {loadingTickets && <h3 role="status">Loading tickets...</h3>}
      {error && <h3 role="status">{error.message}</h3>}
      {!loadingTickets && tickets && tickets?.length === 0 && (
        <h3 role="status">No tickets found</h3>
      )}
      {!loadingTickets && tickets && tickets?.length > 0 && (
        <TicketsList tickets={tickets} />
      )}
    </>
  );
};

export default Start;
