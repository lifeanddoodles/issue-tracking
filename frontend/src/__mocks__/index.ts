import {
  ICommentPopulatedDocument,
  ITicket,
  ITicketPopulatedDocument,
  Priority,
  Status,
} from "../../../shared/interfaces";

export const fakeTickets: (ITicket & { _id: string })[] = [
  {
    _id: "ticket-001",
    title: "Fix login page alignment",
    description:
      "The login page elements are misaligned. Adjust the CSS to align them properly.",
    assignee: "staff-001",
    status: Status.IN_PROGRESS,
    priority: Priority.LOW,
    reporter: "dev-001",
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
    assignee: "dev-002",
    status: Status.OPEN,
    priority: Priority.MEDIUM,
    reporter: "staff-002",
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
    assignee: "dev-001",
    status: Status.IN_PROGRESS,
    priority: Priority.HIGH,
    reporter: "staff-002",
    deadline: "2023-08-30T22:22:30.440Z",
    createdAt: "2023-08-30T22:22:30.440Z",
    lastModifiedAt: "2023-08-30T22:22:30.440Z",
    moveToDevSprint: true,
    isSubtask: false,
    parentTask: null,
  },
];

export const fakePopulatedTickets: ITicketPopulatedDocument[] = [
  {
    _id: "ticket-001",
    title: "Fix login page alignment",
    description:
      "The login page elements are misaligned. Adjust the CSS to align them properly.",
    assignee: {
      _id: "staff-001",
      firstName: "John",
      lastName: "Doe",
    },
    status: Status.IN_PROGRESS,
    priority: Priority.LOW,
    reporter: {
      _id: "dev-001",
      firstName: "Jane",
      lastName: "Doe",
    },
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
    assignee: {
      _id: "dev-002",
      firstName: "Mark",
      lastName: "Holmes",
    },
    status: Status.OPEN,
    priority: Priority.MEDIUM,
    reporter: {
      _id: "staff-002",
      firstName: "Mary",
      lastName: "Smith",
    },
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
    assignee: {
      _id: "dev-001",
      firstName: "Jane",
      lastName: "Doe",
    },
    status: Status.IN_PROGRESS,
    priority: Priority.HIGH,
    reporter: {
      _id: "staff-002",
      firstName: "Mary",
      lastName: "Smith",
    },
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

export const fakeComments: ICommentPopulatedDocument[] = [
  {
    _id: "ticket-001-001",
    ticketId: "ticket-001",
    author: {
      _id: "staff-001",
      firstName: "John",
      lastName: "Doe",
    },
    message: "Hello team, can we have an update on this ticket?",
    createdAt: "2023-08-30T22:22:30.440Z",
    lastModifiedAt: "2023-08-30T22:22:30.440Z",
    isEdited: false,
  },
  {
    _id: "ticket-001-002",
    ticketId: "ticket-001",
    author: {
      _id: "dev-001",
      firstName: "Jane",
      lastName: "Doe",
    },
    message: "Just finished implementing the changes, will deploy soon!",
    createdAt: "2023-08-31T22:22:30.440Z",
    lastModifiedAt: "2023-08-31T22:22:30.440Z",
    isEdited: false,
  },
];

export const fakeOptions = [
  {
    label: "a",
    value: "A",
  },
  {
    label: "b",
    value: "B",
  },
  {
    label: "c",
    value: "C",
  },
];
