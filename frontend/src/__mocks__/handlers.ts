import { http, HttpHandler, HttpResponse } from "msw";
import { IUserDocument } from "shared/interfaces";
import {
  ErrorResponse,
  LoginRequestData,
  SuccessResponse,
} from "../interfaces";
import {
  AUTH_BASE_API_URL,
  COMMENTS_BASE_API_URL,
  COMPANIES_BASE_API_URL,
  PROFILE_API_URL,
  PROJECTS_BASE_API_URL,
  SERVICES_BASE_API_URL,
  TICKETS_BASE_API_URL,
  USERS_BASE_API_URL,
} from "../routes";
import {
  baseUrl,
  fakeDevUser,
  fakePopulatedTickets,
  fakeProjects,
  fakeServices,
  fakeUsers,
} from "./index";

export const handlers: HttpHandler[] = [
  http.post<LoginRequestData, SuccessResponse<IUserDocument>>(
    `${baseUrl}${AUTH_BASE_API_URL}/login`,
    async ({ request }) => {
      const loginData = (await request.json()) as LoginRequestData;
      const fakeUser = fakeUsers.find(
        (user) =>
          user.email === loginData.email && user.password === loginData.password
      );
      if (!fakeUser) {
        return HttpResponse.json<ErrorResponse>(
          { message: "Authentication failed" },
          { status: 401 }
        );
      }
      return HttpResponse.json<Partial<IUserDocument>>(fakeUser, {
        status: 200,
      });
    }
  ),
  http.get<NonNullable<unknown>, SuccessResponse<IUserDocument>>(
    `${baseUrl}${PROFILE_API_URL}`,
    async () => {
      return HttpResponse.json<Partial<IUserDocument>>(fakeDevUser, {
        status: 200,
      });
    }
  ),
  http.get(`${baseUrl}${USERS_BASE_API_URL}`, () => {
    return HttpResponse.json(fakeUsers, { status: 200 });
  }),
  http.get(`${baseUrl}${USERS_BASE_API_URL}/:id`, ({ params }) => {
    const fakeUser = fakeUsers.find((user) => user._id === params.id);
    return HttpResponse.json(fakeUser, { status: 200 });
  }),
  http.post(`${baseUrl}${USERS_BASE_API_URL}`, async ({ request }) => {
    const newUser = await request.json();
    return HttpResponse.json(newUser, { status: 201 });
  }),
  http.get(`${baseUrl}${TICKETS_BASE_API_URL}`, () => {
    return HttpResponse.json(fakePopulatedTickets, { status: 200 });
  }),
  http.get(`${baseUrl}${TICKETS_BASE_API_URL}/:id`, ({ params }) => {
    const fakeTicket = fakePopulatedTickets.find(
      (ticket) => ticket._id === params.id
    );
    return HttpResponse.json(fakeTicket, { status: 200 });
  }),
  http.post(`${baseUrl}${TICKETS_BASE_API_URL}`, async ({ request }) => {
    const newTicket = await request.json();
    return HttpResponse.json(newTicket, { status: 201 });
  }),
  http.get(`${baseUrl}${COMPANIES_BASE_API_URL}`, () => {
    return HttpResponse.text(`Requested companies`, { status: 200 });
  }),
  http.get(`${baseUrl}${COMPANIES_BASE_API_URL}/:id`, ({ params }) => {
    return HttpResponse.text(`Company ${params.id}`, { status: 200 });
  }),
  http.post(`${baseUrl}${COMPANIES_BASE_API_URL}`, async ({ request }) => {
    const newCompany = await request.json();
    return HttpResponse.json(newCompany, { status: 201 });
  }),
  http.get(`${baseUrl}${SERVICES_BASE_API_URL}`, () => {
    return HttpResponse.json(fakeServices, { status: 200 });
  }),
  http.get(`${baseUrl}${SERVICES_BASE_API_URL}/:id`, ({ params }) => {
    return HttpResponse.text(`Service ${params.id}`, { status: 200 });
  }),
  http.post(`${baseUrl}${SERVICES_BASE_API_URL}`, async ({ request }) => {
    const newService = await request.json();
    return HttpResponse.json(newService, { status: 201 });
  }),
  http.get(`${baseUrl}${COMMENTS_BASE_API_URL}`, () => {
    return HttpResponse.text(`Requested comments`, { status: 200 });
  }),
  http.get(`${baseUrl}${COMMENTS_BASE_API_URL}/:id`, ({ params }) => {
    return HttpResponse.text(`Comment ${params.id}`, { status: 200 });
  }),
  http.post(`${baseUrl}${COMMENTS_BASE_API_URL}`, async ({ request }) => {
    const newComment = await request.json();
    return HttpResponse.json(newComment, { status: 201 });
  }),
  http.get(`${baseUrl}${PROJECTS_BASE_API_URL}`, () => {
    return HttpResponse.json(fakeProjects, { status: 200 });
  }),
  http.get(`${baseUrl}${PROJECTS_BASE_API_URL}/:id`, ({ params }) => {
    return HttpResponse.text(`Project ${params.id}`, { status: 200 });
  }),
  http.post(`${baseUrl}${PROJECTS_BASE_API_URL}`, async ({ request }) => {
    const newProject = await request.json();
    return HttpResponse.json(newProject, { status: 201 });
  }),
];
