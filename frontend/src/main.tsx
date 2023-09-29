import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./App.tsx";
import PrivateRoute from "./components/PrivateRoute";
import "./index.css";
import DashboardLayout from "./layout/DashboardLayout";
import GuestPageWrapper from "./layout/GuestPageWrapper";
import CreateTicket from "./pages/CreateTicket/index.tsx";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TicketDetails from "./pages/TicketDetails";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<GuestPageWrapper />}>
        <Route index path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>
      {/* Registered users */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="" element={<Dashboard />} />
          <Route path="/dashboard/create-ticket" element={<CreateTicket />} />
          <Route
            path="/dashboard/tickets/:ticketId"
            element={<TicketDetails />}
          />
        </Route>
      </Route>
      {/* TODO:Add Admin users' routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
