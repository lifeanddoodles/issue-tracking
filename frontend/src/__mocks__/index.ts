import {
  DepartmentTeam,
  ICommentPopulatedDocument,
  ITicket,
  ITicketDocument,
  ITicketPopulatedDocument,
  Industry,
  Priority,
  Status,
  SubscriptionStatus,
  TicketType,
  Tier,
  UserRole,
} from "../../../shared/interfaces";

export const baseUrl =
  process.env.NODE_ENV === "test" ? "http://localhost:5173" : "";

export const fakeUsers = [
  {
    _id: "admin-001",
    firstName: "Sebastian",
    lastName: "Blake",
    position: "Chief Technology Officer",
    email: "sebastian.blake@saascompany.com",
    password: "12345678",
    role: UserRole.ADMIN,
    company: "company-000",
  },
  {
    _id: "staff-001",
    firstName: "John",
    lastName: "Doe",
    position: "Lead Graphic Designer",
    email: "jane.doe@saascompany.com",
    password: "bETj6uCOI",
    role: UserRole.STAFF,
    company: "company-000",
  },
  {
    _id: "dev-001",
    firstName: "Jane",
    lastName: "Doe",
    position: "Fullstack Developer",
    email: "jane.doe@saascompany.com",
    password: "esTkitT1r",
    role: UserRole.DEVELOPER,
    company: "company-000",
  },
  {
    _id: "staff-002",
    firstName: "Mary",
    lastName: "Smith",
    position: "Project Manager",
    email: "mary.smith@saascompany.com",
    password: "bETj6uCOI",
    role: UserRole.STAFF,
    company: "company-000",
  },
  {
    _id: "dev-002",
    firstName: "Mark",
    lastName: "Holmes",
    position: "Fullstack Developer",
    email: "mark.holmes@saascompany.com",
    password: "VYaG1Ew",
    role: UserRole.DEVELOPER,
    company: "company-000",
  },
  {
    _id: "client-001",
    firstName: "Bob",
    lastName: "Smith",
    position: "Marketing Coordinator",
    email: "bob.smith@clientcompany.com",
    password: "bETj6uCOI",
    role: UserRole.CLIENT,
    company: "company-001",
  },
  {
    _id: "client-002",
    firstName: "Rose",
    lastName: "Miller",
    position: "Marketing Coordinator",
    email: "rose.miller@clientcompany.com",
    password: "123456789",
    role: UserRole.CLIENT,
  },
];

export const newFakeUser = {
  _id: "staff-003",
  firstName: "Beth",
  lastName: "Parker",
  position: "Sales Representative",
  email: "beth.parker@saascompany.com",
  password: "j6u9EwT1r",
  role: UserRole.STAFF,
  company: "company-000",
};

export const fakeDevUsers = () =>
  fakeUsers.filter((user) => user.role === UserRole.DEVELOPER);

export const fakeStaffUsers = () =>
  fakeUsers.filter((user) => user.role === UserRole.STAFF);

export const fakeAdminUser = fakeUsers.filter(
  (user) => user.role === UserRole.ADMIN
)[0];

export const fakeStaffUser = fakeStaffUsers()[0];

export const fakeDevUser = fakeDevUsers()[0];

export const fakeClientUser = fakeUsers.filter(
  (user) => user.role === UserRole.CLIENT && user.company === "company-001"
)[0];

export const fakeClientUserNoCompany = fakeUsers.filter(
  (user) => user.role === UserRole.CLIENT && !user.company
)[0];

export const fakeClientUserWithCompany = fakeUsers.filter(
  (user) => user.role === UserRole.CLIENT && user.company
)[0];

export const fakeServices = [
  {
    _id: "service-000",
    name: "Website Builder",
    description: "Drag n' Drop website builder.",
    url: "https://webbuilder.saascompany.com",
    version: "1.0.0",
    tier: Tier.FREE,
  },
  {
    _id: "service-002",
    name: "Email Builder",
    description: "Drag n' Drop email builder.",
    url: "https://emailbuilder.saascompany.com",
    version: "1.0.0",
    tier: Tier.FREE,
  },
];

export const newFakeService = {
  _id: "service-002",
  name: "Analytics Dashboard",
  description: "Analytics dashboard.",
  url: "https://dashboard.saascompany.com",
  version: "1.0.0",
  tier: Tier.PRO,
};

export const fakeCompanies = [
  {
    _id: "company-000",
    name: "SaaS Company",
    url: "saascompany.com",
    email: "contact@saascompany.com",
    subscriptionStatus: SubscriptionStatus.ACTIVE,
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
    email: "contact@clientcompany.com",
    subscriptionStatus: SubscriptionStatus.ONBOARDING,
    employees: [],
    projects: [],
    industry: Industry.FINANCE,
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

export const newFakeCompany = {
  _id: "company-002",
  name: "New Client",
  url: "newclient.com",
  email: "contact@newclient.com",
  subscriptionStatus: SubscriptionStatus.ONBOARDING,
  employees: [],
  projects: [],
  industry: Industry.HEALTHCARE,
  dba: "New Client LLC",
  description: "Lorem ipsum dolor.",
  address: {
    street: "Sesame",
    city: "Test City",
    state: "",
    zip: "",
    country: "",
  },
};

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

export const newFakeProject = {
  _id: "project-002",
  name: "Another Website",
  url: "",
  description: "Another Website",
  company: "company-001",
  services: ["service-000"],
  team: [],
  tickets: [],
};

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

export const newFakeClientTicket: Partial<ITicket> = {
  title: "Fix broken links in documentation",
  description:
    "Several links in the documentation are broken. Update the links to the correct URLs.",
  externalReporter: "client-001",
};

export const newFakeTicket: Partial<ITicketDocument> = {
  _id: "ticket-004",
  ...newFakeClientTicket,
  status: Status.OPEN,
  ticketType: TicketType.ISSUE,
  priority: Priority.HIGH,
  isSubtask: false,
  assignToTeam: DepartmentTeam.DEVELOPMENT,
};

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
    estimatedTime: 10,
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
    estimatedTime: 10,
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

export const newFakeComment = {
  _id: "ticket-001-003",
  ticketId: "ticket-001",
  author: {
    _id: "staff-001",
    firstName: "John",
    lastName: "Doe",
  },
  message: "Thanks for your help!",
  createdAt: "2023-09-01T22:22:30.440Z",
  lastModifiedAt: "2023-09-01T22:22:30.440Z",
  isEdited: false,
};

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
