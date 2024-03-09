import { act, screen, waitFor, within } from "@testing-library/react";
import { Route } from "react-router-dom";
import { IUserDocument } from "shared/interfaces";
import AllTickets from ".";
import {
  fakeAdminUser,
  fakeClientUser,
  fakePopulatedTickets,
} from "../../../../__mocks__";
import NotClientRoute from "../../../../components/NotClientRoute";
import {
  IAuthContext,
  authBase,
  renderWithRouterFromMultipleRoutes,
} from "../../../../tests/utils";
import Dashboard from "../../../account/Dashboard";

enum TableColumns {
  title = "Title",
  status = "Status",
  ticketType = "Type",
  assignee = "Assignee",
  priority = "Priority",
  createdAt = "Created at",
}

describe("AllTickets", () => {
  let auth: IAuthContext;

  beforeAll(() => {
    vi.clearAllMocks();
  });

  describe("if user is a client", async () => {
    beforeEach(async () => {
      auth = {
        user: {
          ...fakeClientUser,
        } as IUserDocument,
        ...authBase,
      };
    });

    test("redirects to dashboard", async () => {
      await act(() =>
        renderWithRouterFromMultipleRoutes(
          ["/dashboard/tickets"],
          auth,
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="" element={<NotClientRoute />}>
              <Route path="/dashboard/tickets" element={<AllTickets />} />
            </Route>
          </>
        )
      );

      const title = await screen.findByRole("heading", {
        name: "Dashboard",
        level: 1,
      });
      expect(title).toBeInTheDocument();
      expect(screen.getByTestId("location-display")).toHaveTextContent(
        "/dashboard"
      );
    });
  });

  describe("if user is not a client", async () => {
    beforeEach(async () => {
      auth = {
        user: {
          ...fakeAdminUser,
        } as IUserDocument,
        ...authBase,
      };
    });

    test("renders data correctly", async () => {
      await act(() =>
        renderWithRouterFromMultipleRoutes(
          ["/dashboard/tickets"],
          auth,
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="" element={<NotClientRoute />}>
              <Route path="/dashboard/tickets" element={<AllTickets />} />
            </Route>
          </>
        )
      );

      await waitFor(async () => {
        expect(screen.getByTestId("location-display")).toHaveTextContent(
          "/dashboard/tickets"
        );
        const element = await screen.findByRole("table");
        expect(element).toBeInTheDocument();

        const cols = await screen.findAllByRole("columnheader");
        const rowGroups = await screen.findAllByRole("rowgroup");
        const tbody = rowGroups[1];
        const rows = await within(tbody).findAllByRole("row");

        expect(cols.length).to.equal(Object.keys(TableColumns).length + 1);
        expect(rows.length).to.equal(fakePopulatedTickets.length);
      });
    });
  });
});
