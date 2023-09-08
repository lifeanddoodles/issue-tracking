import { Link } from "react-router-dom";
import {
  ITicket,
  ITicketPopulatedDocument,
} from "../../../../shared/interfaces";
import { getStatusText } from "../../utils";

interface ITicketsListProps {
  tickets: (ITicket & { _id: string })[] | ITicketPopulatedDocument[];
}
const TicketsList = ({ tickets }: ITicketsListProps) => {
  if (tickets.length === 0) return <h1>No tickets</h1>;
  return (
    <ul>
      {tickets.map((ticket) => {
        const ticketId =
          typeof ticket._id === "string" ? ticket._id : ticket._id.toString();

        return (
          <li key={ticketId}>
            <Link to={`/tickets/${ticketId}`}>
              <article>
                <h3>{ticket.title}</h3>
                <footer>{getStatusText(ticket.status)}</footer>
              </article>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default TicketsList;
