import {
  ITicketDocument,
  ITicketPopulatedDocument,
} from "../../../../shared/interfaces";

interface ITicketsListProps {
  tickets: ITicketDocument[] | ITicketPopulatedDocument[];
}
const TicketsList = ({ tickets }: ITicketsListProps) => {
  return (
    <ul>
      {tickets.map((ticket) => {
        return <li key={ticket._id}>{ticket.title}</li>;
      })}
    </ul>
  );
};

export default TicketsList;
