import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Register from "./pages/Register";
import TicketDetails from "./pages/TicketDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tickets/:ticketId" element={<TicketDetails />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
