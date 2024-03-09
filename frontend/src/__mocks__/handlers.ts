import {
  DefaultBodyType,
  http,
  HttpHandler,
  HttpResponse,
  PathParams,
} from "msw";
import { ICompany, ITicket, IUserDocument } from "shared/interfaces";
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
  fakeComments,
  fakeCompanies,
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
  http.get<PathParams, DefaultBodyType | ErrorResponse>(
    `${baseUrl}${USERS_BASE_API_URL}/:id`,
    ({ params }) => {
      const fakeUser = fakeUsers.find((user) => user._id === params.id);
      return HttpResponse.json(fakeUser, { status: 200 });
    }
  ),
  http.post(`${baseUrl}${USERS_BASE_API_URL}`, async ({ request }) => {
    const newUser = await request.json();
    return HttpResponse.json(newUser, { status: 201 });
  }),
  http.patch<PathParams, DefaultBodyType | ErrorResponse>(
    `${baseUrl}${USERS_BASE_API_URL}/:id`,
    async ({ params, request }) => {
      const fakeUser = fakeUsers.find((user) => user._id === params.id);
      if (!fakeUser) {
        return HttpResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
      const newUserData = (await request.json()) as Partial<IUserDocument>;
      return HttpResponse.json(
        { ...fakeUser, ...newUserData },
        { status: 200 }
      );
    }
  ),
  http.get(`${baseUrl}${TICKETS_BASE_API_URL}`, () => {
    return HttpResponse.json(fakePopulatedTickets, { status: 200 });
  }),
  http.patch<PathParams, DefaultBodyType | ErrorResponse>(
    `${baseUrl}${TICKETS_BASE_API_URL}/:id`,
    async ({ params, request }) => {
      const fakeTicket = fakePopulatedTickets.find(
        (ticket) => ticket._id === params.id
      );
      if (!fakeTicket) {
        return HttpResponse.json(
          { message: "Ticket not found" },
          { status: 404 }
        );
      }
      const newTicketData = (await request.json()) as Partial<ITicket>;
      return HttpResponse.json(
        { ...fakeTicket, ...newTicketData },
        { status: 200 }
      );
    }
  ),
  http.get<PathParams, DefaultBodyType | ErrorResponse>(
    `${baseUrl}${TICKETS_BASE_API_URL}/:id`,
    ({ params }) => {
      const fakeTicket = fakePopulatedTickets.find(
        (ticket) => ticket._id === params.id
      );
      if (!fakeTicket) {
        return HttpResponse.json(
          { message: "Ticket not found" },
          { status: 404 }
        );
      }
      return HttpResponse.json(fakeTicket, { status: 200 });
    }
  ),
  http.post(`${baseUrl}${TICKETS_BASE_API_URL}`, async ({ request }) => {
    const newTicket = await request.json();
    return HttpResponse.json(newTicket, { status: 201 });
  }),
  http.get(`${baseUrl}${COMPANIES_BASE_API_URL}`, () => {
    return HttpResponse.json(fakeCompanies, { status: 200 });
  }),
  http.get<PathParams, DefaultBodyType | ErrorResponse>(
    `${baseUrl}${COMPANIES_BASE_API_URL}/:id`,
    ({ params }) => {
      const fakeCompany = fakeCompanies.find(
        (company) => company._id === params.id
      );
      if (!fakeCompany) {
        return HttpResponse.json<ErrorResponse>(
          { message: "Company not found" },
          { status: 404 }
        );
      }
      return HttpResponse.json(fakeCompany, { status: 200 });
    }
  ),
  http.post(`${baseUrl}${COMPANIES_BASE_API_URL}`, async ({ request }) => {
    const newCompany = await request.json();
    return HttpResponse.json(newCompany, { status: 201 });
  }),
  http.patch<PathParams, Partial<ICompany> | ErrorResponse>(
    `${baseUrl}${COMPANIES_BASE_API_URL}/:id`,
    async ({ params, request }) => {
      const fakeCompany = fakeCompanies.find(
        (company) => company._id === params.id
      );
      if (!fakeCompany) {
        return HttpResponse.json<ErrorResponse>(
          { message: "Company not found" },
          { status: 404 }
        );
      }
      const newCompanyData = (await request.json()) as Partial<ICompany>;
      return HttpResponse.json(
        { ...fakeCompany, ...newCompanyData },
        { status: 200 }
      );
    }
  ),
  http.delete<PathParams, DefaultBodyType | ErrorResponse>(
    `${baseUrl}${COMPANIES_BASE_API_URL}/:id`,
    ({ params }) => {
      const fakeCompany = fakeCompanies.find(
        (company) => company._id === params.id
      );
      if (!fakeCompany) {
        return HttpResponse.json<ErrorResponse>(
          { message: "Company not deleted" },
          { status: 404 }
        );
      }
      return HttpResponse.json(
        { message: "Company deleted successfully" },
        { status: 200 }
      );
    }
  ),
  http.get(`${baseUrl}${SERVICES_BASE_API_URL}`, () => {
    return HttpResponse.json(fakeServices, { status: 200 });
  }),
  http.get<PathParams, DefaultBodyType | ErrorResponse>(
    `${baseUrl}${SERVICES_BASE_API_URL}/:id`,
    ({ params }) => {
      const fakeService = fakeServices.find(
        (service) => service._id === params.id
      );
      if (!fakeService) {
        return HttpResponse.json<ErrorResponse>(
          { message: "Service not found" },
          { status: 404 }
        );
      }
      return HttpResponse.json(fakeService, { status: 200 });
    }
  ),
  http.post(`${baseUrl}${SERVICES_BASE_API_URL}`, async ({ request }) => {
    const newService = await request.json();
    return HttpResponse.json(newService, { status: 201 });
  }),
  http.get(`${baseUrl}${COMMENTS_BASE_API_URL}`, () => {
    return HttpResponse.json(fakeComments, { status: 200 });
  }),
  http.get(`${baseUrl}${COMMENTS_BASE_API_URL}/:id`, ({ params }) => {
    const fakeComment = fakeComments.find(
      (comment) => comment._id === params.id
    );
    if (!fakeComment) {
      return HttpResponse.json<ErrorResponse>(
        { message: "Comment not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(fakeComment, { status: 200 });
  }),
  http.post(`${baseUrl}${COMMENTS_BASE_API_URL}`, async ({ request }) => {
    const newComment = await request.json();
    return HttpResponse.json(newComment, { status: 201 });
  }),
  http.get<PathParams, DefaultBodyType | ErrorResponse>(
    `${baseUrl}${PROJECTS_BASE_API_URL}`,
    ({ request }) => {
      const url = new URL(request.url);

      if (url.searchParams.size > 0) {
        const companyId = url.searchParams.get("company");
        const company = fakeCompanies.find(
          (company) => company._id === companyId
        );
        if (!company) {
          return HttpResponse.json<ErrorResponse>(
            { message: "Company not found" },
            { status: 404 }
          );
        }
        const fakeProjectMatches = fakeProjects.filter((project) =>
          company.projects.includes(project._id)
        );

        return HttpResponse.json(fakeProjectMatches, { status: 200 });
      }
      return HttpResponse.json(fakeProjects, { status: 200 });
    }
  ),
  http.get<PathParams, DefaultBodyType | ErrorResponse>(
    `${baseUrl}${PROJECTS_BASE_API_URL}/:id`,
    ({ params }) => {
      const fakeProject = fakeProjects.find(
        (project) => project._id === params.id
      );
      if (!fakeProject) {
        return HttpResponse.json<ErrorResponse>(
          { message: "Project not found" },
          { status: 404 }
        );
      }
      return HttpResponse.json(fakeProject, { status: 200 });
    }
  ),
  http.post(`${baseUrl}${PROJECTS_BASE_API_URL}`, async ({ request }) => {
    const newProject = await request.json();
    return HttpResponse.json(newProject, { status: 201 });
  }),
];
