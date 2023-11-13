import { http, HttpHandler, HttpResponse } from "msw";
import {
  COMMENTS_BASE_API_URL,
  COMPANIES_BASE_API_URL,
  PROJECTS_BASE_API_URL,
  SERVICES_BASE_API_URL,
  TICKETS_BASE_API_URL,
  USERS_BASE_API_URL,
} from "../routes";
import {
  baseUrl,
  fakePopulatedTickets,
  fakeProjects,
  fakeServices,
  fakeUsers,
} from "./index";

export const handlers: HttpHandler[] = [
  http.get(`${baseUrl}${USERS_BASE_API_URL}`, () => {
    return HttpResponse.json(fakeUsers, { status: 200 });
  }),
  http.get(`${baseUrl}${USERS_BASE_API_URL}/:id`, ({ params }) => {
    const fakeUser = fakeUsers.find((user) => user._id === params.id);
    return HttpResponse.json(fakeUser, { status: 200 });
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
  http.get(`${baseUrl}${COMPANIES_BASE_API_URL}`, () => {
    return HttpResponse.text(`Requested companies`, { status: 200 });
  }),
  http.get(`${baseUrl}${COMPANIES_BASE_API_URL}/:id`, ({ params }) => {
    return HttpResponse.text(`Company ${params.id}`, { status: 200 });
  }),
  http.get(`${baseUrl}${SERVICES_BASE_API_URL}`, () => {
    return HttpResponse.json(fakeServices, { status: 200 });
  }),
  http.get(`${baseUrl}${SERVICES_BASE_API_URL}/:id`, ({ params }) => {
    return HttpResponse.text(`Service ${params.id}`, { status: 200 });
  }),
  http.get(`${baseUrl}${COMMENTS_BASE_API_URL}`, () => {
    return HttpResponse.text(`Requested comments`, { status: 200 });
  }),
  http.get(`${baseUrl}${COMMENTS_BASE_API_URL}/:id`, ({ params }) => {
    return HttpResponse.text(`Comment ${params.id}`, { status: 200 });
  }),
  http.get(`${baseUrl}${PROJECTS_BASE_API_URL}`, () => {
    return HttpResponse.json(fakeProjects, { status: 200 });
  }),
  http.get(`${baseUrl}${PROJECTS_BASE_API_URL}/:id`, ({ params }) => {
    return HttpResponse.text(`Project ${params.id}`, { status: 200 });
  }),
];
