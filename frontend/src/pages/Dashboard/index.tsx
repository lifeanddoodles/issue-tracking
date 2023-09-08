import { useEffect, useState } from "react";
import { ITicket, ITicketPopulatedDocument } from "shared/interfaces";
import TicketsList from "../../components/TicketsList";
import { getTickets } from "../../routes";

const Dashboard = () => {
  const [tickets, setTickets] = useState<
    (ITicket & { _id: string })[] | ITicketPopulatedDocument[] | []
  >([]);

  useEffect(() => {
    getTickets().then((data) => {
      setTickets(data);
    });
  }, []);

  return (
    <>
      <h1>Dashboard</h1>
      <h2>Tickets</h2>
      {tickets.length > 0 && <TicketsList tickets={tickets} />}
    </>
  );
};

export default Dashboard;
