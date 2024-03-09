import { act, screen, within } from "@testing-library/react";
import { ICompanyDocument, IUserDocument } from "shared/interfaces";
import { vi } from "vitest";
import ProjectsByCompany from ".";
import {
  fakeClientUser,
  fakeClientUserWithCompanyNoProjects,
  fakeCompanies,
} from "../../../../__mocks__";
import {
  IAuthContext,
  authBase,
  renderWithRouter,
} from "../../../../tests/utils";

describe("ProjectsByCompany", () => {
  let auth: IAuthContext;

  describe("if company has no projects", async () => {
    beforeAll(() => {
      vi.clearAllMocks();
    });

    beforeEach(async () => {
      auth = {
        user: {
          ...fakeClientUserWithCompanyNoProjects,
        } as IUserDocument,
        ...authBase,
      };
    });

    test("renders not found message", async () => {
      act(() => renderWithRouter(<ProjectsByCompany />, auth));

      const title = await screen.findByText(/no projects found/i);

      expect(title).toBeInTheDocument();
    });
  });

  describe("if company has projects", async () => {
    beforeEach(async () => {
      auth = {
        user: {
          ...fakeClientUser,
        } as IUserDocument,
        ...authBase,
      };
    });

    const company: ICompanyDocument = fakeCompanies.find(
      (company) => company._id === fakeClientUser.company
    ) as unknown as ICompanyDocument;

    enum TableColumns {
      name = "Name",
      url = "URL",
      subscriptionStatus = "Status",
      industry = "Industry",
    }

    test("renders data correctly", async () => {
      act(() => renderWithRouter(<ProjectsByCompany />, auth));

      const cols = await screen.findAllByRole("columnheader");
      const rowGroups = await screen.findAllByRole("rowgroup");
      const tbody = rowGroups[1];
      const rows = await within(tbody).findAllByRole("row");

      expect(cols.length).to.equal(Object.keys(TableColumns).length + 1);
      expect(rows.length).to.equal(company.projects?.length);
    });
  });
});
