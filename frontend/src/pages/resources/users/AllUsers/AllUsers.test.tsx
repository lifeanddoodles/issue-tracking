import { act, screen, waitFor, within } from "@testing-library/react";
import { Route } from "react-router-dom";
import { IUserDocument } from "shared/interfaces";
import AllUsers from ".";
import {
  fakeAdminUser,
  fakeClientUser,
  fakeUsers,
} from "../../../../__mocks__";
import NotClientRoute from "../../../../components/NotClientRoute";
import {
  IAuthContext,
  authBase,
  renderWithRouterFromMultipleRoutes,
} from "../../../../tests/utils";
import Dashboard from "../../../account/Dashboard";

enum TableColumns {
  firstName = "First Name",
  lastName = "Last Name",
  email = "Email",
  company = "Company",
  position = "Position",
  role = "Role",
  department = "Department",
}

describe("AllUsers", () => {
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
          ["/dashboard/users"],
          auth,
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="" element={<NotClientRoute />}>
              <Route path="/dashboard/users" element={<AllUsers />} />
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
          ["/dashboard/users"],
          auth,
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="" element={<NotClientRoute />}>
              <Route path="/dashboard/users" element={<AllUsers />} />
            </Route>
          </>
        )
      );

      await waitFor(async () => {
        expect(screen.getByTestId("location-display")).toHaveTextContent(
          "/dashboard/users"
        );
        const element = await screen.findByRole("table");
        expect(element).toBeInTheDocument();

        const cols = await screen.findAllByRole("columnheader");
        const rowGroups = await screen.findAllByRole("rowgroup");
        const tbody = rowGroups[1];
        const rows = await within(tbody).findAllByRole("row");

        expect(cols.length).to.equal(Object.keys(TableColumns).length + 1);
        expect(rows.length).to.equal(fakeUsers.length);
      });
    });
  });
});
