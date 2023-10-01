import { Link } from "react-router-dom";
import {
  ITicket,
  ITicketPopulatedDocument,
} from "../../../../shared/interfaces";
import {
  getStatusClasses,
  getStatusText,
  getVariantClasses,
} from "../../utils";
import Badge from "../Badge";
import Heading from "../Heading";

interface ITicketsListProps {
  tickets: (ITicket & { _id: string })[] | ITicketPopulatedDocument[] | [];
}
const TicketsList = ({ tickets }: ITicketsListProps) => {
  if (tickets.length === 0) return <h1>No tickets</h1>;

  const variantClasses = getVariantClasses("transparent");

  return (
    <ul>
      {tickets.map((ticket) => {
        const ticketId =
          typeof ticket._id === "string" ? ticket._id : ticket._id.toString();

        return (
          <li key={ticketId} className="ticket mb-4">
            <article className="">
              <Link
                to={`/dashboard/tickets/${ticketId}`}
                className={`ticket-list__link w-full mb-2 rounded-lg ${variantClasses} flex justify-between`}
              >
                <Heading
                  text={ticket.title}
                  level={3}
                  marginBottom={3}
                  className="text-lg"
                />
                <Badge
                  text={getStatusText(ticket.status)}
                  className={getStatusClasses(ticket.status)}
                />
              </Link>
            </article>
          </li>
        );
      })}
    </ul>
  );
};

export default TicketsList;
