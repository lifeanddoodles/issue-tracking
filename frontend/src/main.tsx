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
import AdminRoute from "./components/AdminRoute";
import NotClientRoute from "./components/NotClientRoute";
import PrivateRoute from "./components/PrivateRoute";
import "./index.css";
import DashboardLayout from "./layout/DashboardLayout";
import GuestPageWrapper from "./layout/GuestPageWrapper";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import AllCompanies from "./pages/companies/AllCompanies/index.tsx";
import CompanyDetails from "./pages/companies/CompanyDetails/index.tsx";
import CreateCompany from "./pages/companies/CreateCompany/index.tsx";
import AllProjects from "./pages/projects/AllProjects/index.tsx";
import CreateProject from "./pages/projects/CreateProject/index.tsx";
import ProjectDetails from "./pages/projects/ProjectDetails/index.tsx";
import ProjectsByCompany from "./pages/projects/ProjectsByCompany/index.tsx";
import CreateService from "./pages/services/CreateService/index.tsx";
import AllTickets from "./pages/tickets/AllTickets/index.tsx";
import CreateTicket from "./pages/tickets/CreateTicket/index.tsx";
import TicketDetails from "./pages/tickets/TicketDetails/index.tsx";
import AllUsers from "./pages/users/AllUsers/index.tsx";
import CreateUser from "./pages/users/CreateUser/index.tsx";
import UserDetails from "./pages/users/UserDetails/index.tsx";

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
          <Route
            path="/dashboard/tickets/:ticketId"
            element={<TicketDetails />}
          />
          <Route path="/dashboard/tickets/create" element={<CreateTicket />} />
          <Route path="/dashboard/users/:userId" element={<UserDetails />} />
          <Route path="/dashboard/profile/" element={<Profile />} />
          <Route path="/dashboard/my-company/" element={<CompanyDetails />} />
          <Route
            path="/dashboard/companies/:companyId"
            element={<CompanyDetails />}
          />
          <Route
            path="/dashboard/my-projects"
            element={<ProjectsByCompany />}
          />
          <Route
            path="/dashboard/projects/create"
            element={<CreateProject />}
          />
          <Route
            path="/dashboard/projects/:projectId"
            element={<ProjectDetails />}
          />
          {/* TODO:Add Not Client users' routes */}
          <Route path="" element={<NotClientRoute />}>
            <Route path="/dashboard/users" element={<AllUsers />} />
            <Route path="/dashboard/companies" element={<AllCompanies />} />
            <Route path="/dashboard/projects" element={<AllProjects />} />
            <Route path="/dashboard/tickets/" element={<AllTickets />} />
          </Route>
          {/* TODO:Add Admin users' routes */}
          <Route path="" element={<AdminRoute />}>
            <Route
              path="/dashboard/companies/create"
              element={<CreateCompany />}
            />
            <Route
              path="/dashboard/services/create"
              element={<CreateService />}
            />
            <Route path="/dashboard/users/create" element={<CreateUser />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
