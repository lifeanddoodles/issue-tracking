import { Navigate, Route, Routes } from "react-router-dom";
import GuestPageWrapper from "./layout/GuestPageWrapper";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Start from "./pages/Start";
import TicketDetails from "./pages/TicketDetails";

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="/dashboard" element={<Start />} />
        <Route
          path="/dashboard/tickets/:ticketId"
          element={<TicketDetails />}
        />
      </Route>
      <Route path="/" element={<GuestPageWrapper />}>
        <Route index path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
