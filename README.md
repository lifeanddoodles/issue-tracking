# SaaS Issue Tracker Documentation

## Introduction

The SaaS Issue Tracker is a powerful tool designed to streamline issue management across projects and services. It provides Role-Based Access Control (RBAC) to ensure secure and appropriate access to resources. The application includes features for managing users, companies, projects, tickets, comments, and services.

## Table of Contents

- [User Management](#user-management)

   - [User Registration](#user-registration)
   - [User Authentication](#user-authentication)
   - [Role Management](#role-management)

- [Company Management](#company-management)

   - [Creating and Managing Companies](#creating-and-managing-companies)
   - [Employee Assignment](#employee-assignment)

- [Project Management](#project-management)

   - [Creating and Managing Projects](#creating-and-managing-projects)

- [Ticket Management](#ticket-management)

   - [Creating and Managing Tickets](#creating-and-managing-tickets)

- [Comment Management](#comment-management)

   - [Adding Comments to Tickets](#adding-comments-to-tickets)

- [Service Management](#service-management)

   - [Creating and Managing Services](#creating-and-managing-services)

- [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
   - [Roles and Permissions](#roles-and-permissions)

## User Management

### User Registration

Users can register via email and password or sign up with Google. The registration process requires the following details:

- Full Name
- Email Address
- Password (if registering via email)

### User Authentication

Authentication ensures secure access to the application. Users can log in using their email and password or their Google account.

### Role Management

Users are assigned roles that determine their access levels. The roles include:

- Admin
- Project Manager
- Employee
- Client

Currently all roles except for Client refer to internal roles for the SaaS team. Additional functionality can be added to further customize access for a client to its company's resources, such as a "Client Role" or "Company Role", for example. In the meantime, all users added to the same company have the same level of access.

## Company Management

### Creating and Managing Companies

- Admins can create and manage companies.
- Each company can have multiple users (employees).
- An employee ID can only exist in one company.

### Employee Assignment

- Employees can be assigned to companies during the registration process or later by an Admin.
- Only employees of the same company can access the company's resources.

## Project Management

### Creating and Managing Projects

- Projects can only be created by users belonging to a company. A company can have multiple projects.

## Ticket Management

### Creating and Managing Tickets

- Tickets can be created for projects or services.
- Each project/service can have multiple tickets.

## Comment Management

### Adding Comments to Tickets

- All authenticated users can add comments to tickets to facilitate communication and track progress.
- Comments are attached to specific tickets.

## Service Management

### Creating and Managing Services

- Service management is restricted and general availability depends on the company's tier.
- CRUD operations for services are not accessible to Clients, only Read when a service is being used in one of their projects.

## Role-Based Access Control (RBAC)

### Roles and Permissions

#### Admin

- Full access to all resources
- Manage users, companies, projects, tickets, comments, and services

#### Project Manager

- Full access to projects and tickets within their company
- Manage projects and tickets
- Add comments to tickets

#### Employee (Internal)

Access to projects and tickets within their company
View and manage tickets assigned to them
Add comments to tickets

#### Client

Access to tickets related to their projects
Cannot manage services
Restricted access based on company tier

## Conclusion

The SaaS Issue Tracker provides a robust platform for managing issues across projects and services. Its Role-Based Access Control ensures secure and appropriate access to resources, enhancing productivity and collaboration within companies.
