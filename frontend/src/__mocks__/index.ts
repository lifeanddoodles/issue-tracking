import {
  DepartmentTeam,
  ICommentPopulatedDocument,
  ITicketDocument,
  ITicketPopulatedDocument,
  Priority,
  Status,
  TicketType,
  UserRole,
} from "../../../shared/interfaces";

export const baseUrl =
  process.env.NODE_ENV === "test" ? "http://localhost:5173" : "";

export const fakeTickets: Partial<ITicketDocument>[] = [
  {
    _id: "ticket-001",
    title: "Fix login page alignment",
    description:
      "The login page elements are misaligned. Adjust the CSS to align them properly.",
    assignee: "staff-001",
    status: Status.IN_PROGRESS,
    ticketType: TicketType.ISSUE,
    priority: Priority.LOW,
    reporter: "dev-001",
    moveToDevSprint: true,
    assignToTeam: DepartmentTeam.DEVELOPMENT,
    deadline: "2023-08-30T22:22:30.440Z",
    isSubtask: false,
  },
  {
    _id: "ticket-002",
    title: "Add user profile picture support",
    description:
      "Allow users to upload and display profile pictures on their profiles.",
    assignee: "dev-002",
    status: Status.OPEN,
    ticketType: TicketType.ISSUE,
    priority: Priority.MEDIUM,
    reporter: "staff-002",
    deadline: "2023-08-30T22:22:30.440Z",
    moveToDevSprint: true,
    assignToTeam: DepartmentTeam.DEVELOPMENT,
    isSubtask: false,
  },
  {
    _id: "ticket-003",
    title: "Implement password reset functionality",
    description:
      "Create a mechanism for users to reset their passwords if they forget them.",
    assignee: "dev-001",
    status: Status.IN_PROGRESS,
    ticketType: TicketType.ISSUE,
    priority: Priority.HIGH,
    reporter: "staff-002",
    deadline: "2023-08-30T22:22:30.440Z",
    moveToDevSprint: true,
    assignToTeam: DepartmentTeam.DEVELOPMENT,
    isSubtask: false,
  },
];

export const fakePopulatedTickets: (
  | Partial<ITicketPopulatedDocument>
  | ITicketPopulatedDocument
)[] = [
  {
    _id: "ticket-001",
    title: "Fix login page alignment",
    description:
      "The login page elements are misaligned. Adjust the CSS to align them properly.",
    assignee: {
      _id: "dev-001",
      firstName: "Jane",
      lastName: "Doe",
    },
    status: Status.IN_PROGRESS,
    ticketType: TicketType.ISSUE,
    priority: Priority.LOW,
    reporter: {
      _id: "staff-001",
      firstName: "John",
      lastName: "Doe",
    },
    moveToDevSprint: true,
    assignToTeam: DepartmentTeam.DEVELOPMENT,
    deadline: "2023-08-30T22:22:30.440Z",
    isSubtask: false,
    createdAt: "2023-08-29T00:21:32.520+00:00",
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
    ticketType: TicketType.ISSUE,
    priority: Priority.MEDIUM,
    reporter: {
      _id: "staff-002",
      firstName: "Mary",
      lastName: "Smith",
    },
    deadline: "2023-08-30T22:22:30.440Z",
    moveToDevSprint: true,
    assignToTeam: DepartmentTeam.DEVELOPMENT,
    isSubtask: false,
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
    ticketType: TicketType.ISSUE,
    priority: Priority.HIGH,
    reporter: {
      _id: "staff-002",
      firstName: "Mary",
      lastName: "Smith",
    },
    deadline: "2023-08-30T22:22:30.440Z",
    moveToDevSprint: true,
    assignToTeam: DepartmentTeam.DEVELOPMENT,
    isSubtask: false,
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
    role: UserRole.STAFF,
    company: "000",
  },
  {
    _id: "dev-001",
    firstName: "Jane",
    lastName: "Doe",
    position: "Fullstack Developer",
    email: "jane.doe@someagency.com",
    password: "esTkitT1r",
    role: UserRole.DEVELOPER,
    company: "000",
  },
  {
    _id: "staff-002",
    firstName: "Mary",
    lastName: "Smith",
    position: "Project Manager",
    email: "mary.smith@someagency.com",
    password: "bETj6uCOI",
    role: UserRole.STAFF,
    company: "000",
  },
  {
    _id: "dev-002",
    firstName: "Mark",
    lastName: "Holmes",
    position: "Fullstack Developer",
    email: "mark.holmes@someagency.com",
    password: "VYaG1Ew",
    role: UserRole.DEVELOPER,
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

export const fakeServices = [
  {
    _id: "service-000",
    name: "Website Builder",
    description: "Drag n' Drop website builder.",
    url: "https://webbuilder.sampleagency.com",
    version: "1.0.0",
    tier: "FREE",
  },
  {
    _id: "service-002",
    name: "Email Builder",
    description: "Drag n' Drop email builder.",
    url: "https://emailbuilder.sampleagency.com",
    version: "1.0.0",
    tier: "FREE",
  },
];

export const fakeProjects = [
  {
    _id: "project-000",
    name: "Website",
    url: "",
    description: "Landing page",
    company: "company-000",
    services: ["service-000"],
    team: [],
    tickets: [],
  },
  {
    _id: "project-001",
    name: "Website",
    url: "",
    description: "Landing page",
    company: "company-001",
    services: ["service-000", "service-001"],
    team: [],
    tickets: [],
  },
];

export const fakeCompanies = [
  {
    _id: "company-000",
    name: "SaaS Company",
    url: "saascompany.com",
    subscriptionStatus: "ONBOARDING",
    employees: [],
    projects: [],
    dba: "SaaS LLC",
    description: "Lorem ipsum dolor.",
    address: {
      street: "Sesame",
      city: "Test City",
      state: "",
      zip: "",
      country: "",
    },
  },
  {
    _id: "company-001",
    name: "Client Company",
    url: "clientcompany.com",
    subscriptionStatus: "ONBOARDING",
    employees: [],
    projects: [],
    industry: "FINANCE",
    dba: "Client Company LLC",
    description: "Lorem ipsum dolor.",
    address: {
      street: "Sesame",
      city: "Test City",
      state: "",
      zip: "",
      country: "",
    },
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
