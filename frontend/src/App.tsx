import { useEffect, useState } from "react";
import "./App.css";
import TicketsList from "./components/TicketsList";

function App() {
  const [tickets, setTickets] = useState([]);
  const getTickets = async () => {
    const response = await fetch("/api/tickets");
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    getTickets().then((data) => {
      setTickets(data);
    });
  }, []);

  return (
    <>
      <TicketsList tickets={tickets} />
    </>
  );
}

export default App;
