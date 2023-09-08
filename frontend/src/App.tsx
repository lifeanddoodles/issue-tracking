import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import TicketDetails from "./pages/TicketDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tickets/:ticketId" element={<TicketDetails />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
