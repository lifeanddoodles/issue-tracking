import {
  IComment,
  ITicket,
  Priority,
  Status,
} from "../../../shared/interfaces";

export const fakeTickets: (ITicket & { _id: string })[] = [
  {
    _id: "ticket-001",
    title: "Fix login page alignment",
    description:
      "The login page elements are misaligned. Adjust the CSS to align them properly.",
    assignee: "5",
    status: Status.InProgress,
    priority: Priority.Low,
    reporter: "53",
    moveToDevSprint: true,
    deadline: "2023-08-30T22:22:30.440Z",
    createdAt: "2023-08-30T22:22:30.440Z",
    lastModifiedAt: "2023-08-30T22:22:30.440Z",
    isSubtask: false,
    parentTask: null,
  },
  {
    _id: "ticket-002",
    title: "Add user profile picture support",
    description:
      "Allow users to upload and display profile pictures on their profiles.",
    assignee: "12",
    status: Status.Open,
    priority: Priority.Medium,
    reporter: "53",
    deadline: "2023-08-30T22:22:30.440Z",
    createdAt: "2023-08-30T22:22:30.440Z",
    lastModifiedAt: "2023-08-30T22:22:30.440Z",
    moveToDevSprint: true,
    isSubtask: false,
    parentTask: null,
  },
  {
    _id: "ticket-003",
    title: "Implement password reset functionality",
    description:
      "Create a mechanism for users to reset their passwords if they forget them.",
    assignee: "12",
    status: Status.InProgress,
    priority: Priority.High,
    reporter: "15",
    deadline: "2023-08-30T22:22:30.440Z",
    createdAt: "2023-08-30T22:22:30.440Z",
    lastModifiedAt: "2023-08-30T22:22:30.440Z",
    moveToDevSprint: true,
    isSubtask: false,
    parentTask: null,
  },
];

export const fakeUsers = [
  {
    _id: "staff-001",
    firstName: "John",
    lastName: "Doe",
    position: "Lead Graphic Designer",
    email: "jane.doe@someagency.com",
    password: "bETj6uCOI",
    role: "STAFF",
    company: "000",
  },
  {
    _id: "dev-001",
    firstName: "Jane",
    lastName: "Doe",
    position: "Fullstack Developer",
    email: "jane.doe@someagency.com",
    password: "esTkitT1r",
    role: "DEVELOPER",
    company: "000",
  },
  {
    _id: "staff-002",
    firstName: "Mary",
    lastName: "Smith",
    position: "Project Manager",
    email: "mary.smith@someagency.com",
    password: "bETj6uCOI",
    role: "STAFF",
    company: "000",
  },
  {
    _id: "dev-002",
    firstName: "Mark",
    lastName: "Holmes",
    position: "Fullstack Developer",
    email: "mark.holmes@someagency.com",
    password: "VYaG1Ew",
    role: "DEVELOPER",
    company: "000",
  },
];

export const fakeDevUsers = () =>
  fakeUsers.filter((user) => user.role === "DEVELOPER");

export const fakeStaffUsers = () =>
  fakeUsers.filter((user) => user.role === "STAFF");

export const fakeStaffUser = fakeStaffUsers()[0];

export const fakeDevUser = fakeDevUsers()[0];

export const fakeComments: (IComment & { _id: string })[] = [
  {
    _id: "ticket-001-001",
    ticketId: "ticket-001",
    author: "staff-001",
    message: "Hello team, can we have an update on this ticket?",
    createdAt: "2023-08-30T22:22:30.440Z",
    lastModifiedAt: "2023-08-30T22:22:30.440Z",
    isEdited: false,
  },
  {
    _id: "ticket-001-002",
    ticketId: "ticket-001",
    author: "dev-001",
    message: "Just finished implementing the changes, will deploy soon!",
    createdAt: "2023-08-31T22:22:30.440Z",
    lastModifiedAt: "2023-08-31T22:22:30.440Z",
    isEdited: false,
  },
];
