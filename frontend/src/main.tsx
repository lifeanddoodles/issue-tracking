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
import AuthProvider from "./context/AuthProvider.tsx";
import "./index.css";
import CommonLayout from "./layout/CommonLayout";
import DashboardLayout from "./layout/DashboardLayout";
import GuestPageWrapper from "./layout/GuestPageWrapper";
import Home from "./pages/Home";
import Dashboard from "./pages/account/Dashboard/index.tsx";
import Profile from "./pages/account/Profile/index.tsx";
import LoginSuccess from "./pages/auth/Login/LoginSuccess.tsx";
import Login from "./pages/auth/Login/index.tsx";
import Register from "./pages/auth/Register/index.tsx";
import About from "./pages/info/About/index.tsx";
import SeeTheCode from "./pages/info/SeeTheCode/index.tsx";
import AllCompanies from "./pages/resources/companies/AllCompanies/index.tsx";
import CompanyDetails from "./pages/resources/companies/CompanyDetails/index.tsx";
import CreateCompany from "./pages/resources/companies/CreateCompany/index.tsx";
import AllProjects from "./pages/resources/projects/AllProjects/index.tsx";
import CreateProject from "./pages/resources/projects/CreateProject/index.tsx";
import ProjectDetails from "./pages/resources/projects/ProjectDetails/index.tsx";
import ProjectsByCompany from "./pages/resources/projects/ProjectsByCompany/index.tsx";
import AllServices from "./pages/resources/services/AllServices/index.tsx";
import CreateService from "./pages/resources/services/CreateService/index.tsx";
import ServiceDetails from "./pages/resources/services/ServiceDetails/index.tsx";
import AllTickets from "./pages/resources/tickets/AllTickets/index.tsx";
import CreateTicket from "./pages/resources/tickets/CreateTicket/index.tsx";
import TicketDetails from "./pages/resources/tickets/TicketDetails/index.tsx";
import AllUsers from "./pages/resources/users/AllUsers/index.tsx";
import CreateUser from "./pages/resources/users/CreateUser/index.tsx";
import UserDetails from "./pages/resources/users/UserDetails/index.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <AuthProvider>
          <App />
        </AuthProvider>
      }
    >
      <Route path="" element={<GuestPageWrapper />}>
        <Route index path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/success" element={<LoginSuccess />} />
      </Route>
      <Route path="" element={<CommonLayout />}>
        <Route path="/see-the-code" element={<SeeTheCode />} />
        <Route path="/about-the-dev" element={<About />} />
      </Route>
      {/* Registered users */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="" element={<Dashboard />} />
          <Route path="/dashboard/my-tickets" element={<AllTickets />} />
          <Route
            path="/dashboard/tickets/:ticketId"
            element={<TicketDetails />}
          />
          <Route path="/dashboard/tickets/create" element={<CreateTicket />} />
          <Route path="/dashboard/my-team" element={<AllUsers />} />
          <Route path="/dashboard/users/:userId" element={<UserDetails />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/my-company" element={<CompanyDetails />} />
          <Route
            path="/dashboard/companies/create"
            element={<CreateCompany />}
          />
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
            <Route path="/dashboard/tickets" element={<AllTickets />} />
            <Route path="/dashboard/services" element={<AllServices />} />
            <Route
              path="/dashboard/services/:serviceId"
              element={<ServiceDetails />}
            />
          </Route>
          {/* TODO:Add Admin users' routes */}
          <Route path="" element={<AdminRoute />}>
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
