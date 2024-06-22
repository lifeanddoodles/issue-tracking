import { Link } from "react-router-dom";
import {
  ITicketDocument,
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
  tickets: ITicketDocument[] | ITicketPopulatedDocument[];
}
const TicketsList = ({ tickets }: ITicketsListProps) => {
  if (tickets.length === 0) return <Heading text="No tickets" level={1} />;

  const variantClasses = getVariantClasses("transparent");

  return (
    <ul>
      {tickets.map((ticket) => {
        const ticketId = ticket._id as string;

        return (
          <li key={ticketId} className="ticket mb-4">
            <article className="">
              <Link
                to={`/dashboard/tickets/${ticketId}`}
                className={`ticket-list__link w-full mb-2 rounded-lg ${variantClasses} flex justify-between items-start`}
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
