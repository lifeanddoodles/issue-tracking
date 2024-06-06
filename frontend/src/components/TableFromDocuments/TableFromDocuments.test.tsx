import { render, screen, within } from "@testing-library/react";
import user from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Mock, describe, vi } from "vitest";
import TableFromDocuments from ".";
import {
  ICompanyDocument,
  SubscriptionStatus,
} from "../../../../shared/interfaces";
import { fakeCompanies } from "../../__mocks__";
import { COMPANIES_BASE_API_URL } from "../../routes";
import { getColumnTitles } from "../../utils";
import Button from "../Button";

describe("TableFromDocuments", () => {
  const getRows = vi.fn();
  const resourceBaseUrl = "/dashboard/companies";
  enum TableColumns {
    name = "Name",
    url = "URL",
    subscriptionStatus = "Status",
    industry = "Industry",
  }
  const formatCompanies = (companiesList: Partial<ICompanyDocument>[]) => {
    return companiesList?.map((company) => {
      return {
        id: company._id as string,
        data: {
          name: company.name,
          subscriptionStatus: company.subscriptionStatus,
          url: company.url,
          industry: company.industry,
        },
      };
    });
  };
  let formattedCompanies = formatCompanies(
    fakeCompanies as Partial<ICompanyDocument>[]
  );
  const filteredCompanies = fakeCompanies.filter(
    (company) => company.subscriptionStatus === SubscriptionStatus.ACTIVE
  );
  const applyFilters = vi.fn(() => {
    formattedCompanies = formatCompanies(filteredCompanies);
  });

  test("renders correct number of rows and columns", () => {
    render(
      <MemoryRouter>
        <TableFromDocuments
          cols={getColumnTitles<ICompanyDocument>(
            formattedCompanies[0],
            TableColumns
          )}
          rows={formattedCompanies}
          resourceBaseUrl={resourceBaseUrl}
          apiBaseUrl={COMPANIES_BASE_API_URL}
          refetch={getRows}
        />
      </MemoryRouter>
    );

    const cols = screen.getAllByRole("columnheader");
    const tbody = screen.getAllByRole("rowgroup")[1];
    const rows = within(tbody).getAllByRole("row");

    expect(cols.length).to.equal(Object.keys(TableColumns).length + 1);
    expect(rows.length).to.equal(fakeCompanies.length);
  });

  test("handles View resource", async () => {
    user.setup();

    const pushSpy: Mock = vi.hoisted(() => vi.fn());

    vi.mock(`react-router-dom`, async (): Promise<unknown> => {
      const actualReactRouterDom: Record<string, unknown> =
        await vi.importActual(`react-router-dom`);

      return {
        ...actualReactRouterDom,
        Link: ({ children, to }: { children: React.ReactNode; to: string }) => {
          return (
            <a
              href={to}
              onClick={(e) => {
                e.preventDefault();
                pushSpy(to);
              }}
            >
              {children}
            </a>
          );
        },
      };
    });

    render(
      <MemoryRouter>
        <TableFromDocuments
          cols={getColumnTitles<ICompanyDocument>(
            formattedCompanies[0],
            TableColumns
          )}
          rows={formattedCompanies}
          resourceBaseUrl={resourceBaseUrl}
          apiBaseUrl={COMPANIES_BASE_API_URL}
          refetch={getRows}
        />
      </MemoryRouter>
    );

    const tbody = screen.getAllByRole("rowgroup")[1];
    const rows = within(tbody).getAllByRole("row");
    const firstRow = rows[0];
    const viewButton = within(firstRow).getByRole("link", { name: "View" });

    expect(viewButton).toBeInTheDocument();

    await user.click(viewButton);
    expect(pushSpy).toHaveBeenCalledWith(
      `${resourceBaseUrl}/${fakeCompanies[0]._id}`
    );
  });

  test("handles Delete resource", async () => {
    user.setup();

    render(
      <MemoryRouter>
        <TableFromDocuments
          cols={getColumnTitles<ICompanyDocument>(
            formattedCompanies[0],
            TableColumns
          )}
          rows={formattedCompanies}
          resourceBaseUrl={resourceBaseUrl}
          apiBaseUrl={COMPANIES_BASE_API_URL}
          refetch={getRows}
        />
      </MemoryRouter>
    );

    const tbody = screen.getAllByRole("rowgroup")[1];
    const rows = within(tbody).getAllByRole("row");
    const firstRow = rows[0];
    const deleteButton = within(firstRow).getByRole("button", {
      name: "Delete",
    });

    expect(deleteButton).toBeInTheDocument();

    await user.click(deleteButton);
    expect(getRows).toHaveBeenCalledOnce();
  });

  test("applies filters", async () => {
    user.setup();

    const { rerender } = render(
      <>
        <Button onClick={applyFilters}>Apply filter</Button>
        <MemoryRouter>
          <TableFromDocuments
            cols={getColumnTitles<ICompanyDocument>(
              formattedCompanies[0],
              TableColumns
            )}
            rows={formattedCompanies}
            resourceBaseUrl={resourceBaseUrl}
            apiBaseUrl={COMPANIES_BASE_API_URL}
            refetch={getRows}
          />
        </MemoryRouter>
      </>
    );

    const tbody = screen.getAllByRole("rowgroup")[1];
    const rows = within(tbody).getAllByRole("row");
    const filterButton = screen.getByRole("button", { name: "Apply filter" });

    expect(rows.length).to.equal(fakeCompanies.length);

    await user.click(filterButton);
    expect(applyFilters).toHaveBeenCalledOnce();

    rerender(
      <>
        <Button onClick={applyFilters}>Apply filter</Button>
        <MemoryRouter>
          <TableFromDocuments
            cols={getColumnTitles<ICompanyDocument>(
              formattedCompanies[0],
              TableColumns
            )}
            rows={formattedCompanies}
            resourceBaseUrl={resourceBaseUrl}
            apiBaseUrl={COMPANIES_BASE_API_URL}
            refetch={getRows}
          />
        </MemoryRouter>
      </>
    );

    const tbodyUpdated = screen.getAllByRole("rowgroup")[1];
    const rowsUpdated = within(tbodyUpdated).getAllByRole("row");

    expect(rowsUpdated.length).to.equal(filteredCompanies.length);
  });
});
