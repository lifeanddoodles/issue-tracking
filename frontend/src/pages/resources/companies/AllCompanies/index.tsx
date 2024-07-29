import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ICompanyDocument,
  Industry,
  SubscriptionStatus,
} from "shared/interfaces";
import Button from "../../../../components/Button";
import Pagination from "../../../../components/Pagination";
import usePagination from "../../../../components/Pagination/hooks/usePagination";
import Select from "../../../../components/Select";
import TableFromDocuments from "../../../../components/TableFromDocuments";
import useFetch from "../../../../hooks/useFetch";
import Row from "../../../../layout/Row";
import { COMPANIES_BASE_API_URL } from "../../../../routes";
import {
  getColumnTitles,
  getIndustryOptions,
  getSubscriptionStatusOptions,
  objectToQueryString,
} from "../../../../utils";

enum TableColumns {
  name = "Name",
  url = "URL",
  subscriptionStatus = "Status",
  industry = "Industry",
}

const AllCompanies = () => {
  const {
    data: companiesResponse,
    loading,
    error,
    sendRequest,
  } = useFetch<{
    data: ICompanyDocument[] | [];
    count: number;
    pagination: { [key: string]: number; limit: number };
    success: boolean;
  }>();
  const companies = useMemo(
    () => companiesResponse?.data,
    [companiesResponse?.data]
  );
  const { currentPage, setCurrentPage } = usePagination();
  const limit = 10;

  const [filters, setFilters] = useState<
    Partial<{
      name: string;
      url?: string;
      subscriptionStatus: SubscriptionStatus;
      email?: string;
      industry?: Industry;
    }>
  >({});
  const [query, setQuery] = useState("");

  const applyFilters: () => void = useCallback(() => {
    const queryString = objectToQueryString<{
      name: string;
      url?: string;
      subscriptionStatus: SubscriptionStatus;
      email?: string;
      industry?: Industry;
    }>(filters);
    setQuery(queryString);
  }, [filters]);

  const clearFilters: () => void = useCallback(() => {
    setFilters({});
    setQuery("");
    // TODO: Reset controllers to select empty option
  }, []);

  const getRows = useCallback(() => {
    sendRequest({
      url: `${COMPANIES_BASE_API_URL}?page=${currentPage}&limit=${limit}${
        query ? `&${query}` : ""
      }`,
    });
  }, [currentPage, query, sendRequest]);

  const formattedCompanies = useMemo(
    () =>
      !loading &&
      companies?.map((company) => {
        return {
          id: company._id as string,
          data: {
            name: company.name,
            subscriptionStatus: company.subscriptionStatus,
            url: company.url,
            industry: company.industry,
          },
        };
      }),
    [companies, loading]
  );

  const handleChangeFilters = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setFilters({
        ...filters,
        [e.target.name]: e.target.value,
      });
    },
    [filters]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);
    },
    [setCurrentPage]
  );

  useEffect(() => {
    getRows();
  }, [getRows]);

  if (error) return <h3 role="status">{error.message}</h3>;

  return (
    <>
      <div className="filters mb-8">
        <Row className="gap-2">
          <Select
            id="subscriptionStatus"
            value={filters?.subscriptionStatus || ""}
            options={getSubscriptionStatusOptions("Status")}
            onChange={handleChangeFilters}
            direction="col"
            className="shrink-0 grow max-w-[10rem]"
          />
          <Select
            id="industry"
            value={filters?.industry || ""}
            options={getIndustryOptions("Industry")}
            onChange={handleChangeFilters}
            direction="col"
            className="shrink-0 grow max-w-[10rem]"
          />
        </Row>
        <Row className="gap-2">
          <Button onClick={applyFilters}>Apply filters</Button>
          <Button onClick={clearFilters}>Clear filters</Button>
        </Row>
      </div>
      {loading && <h3 role="status">Loading companies...</h3>}
      {!loading && formattedCompanies && formattedCompanies?.length === 0 && (
        <h3 role="status">No companies found</h3>
      )}
      {!loading &&
        companiesResponse &&
        formattedCompanies &&
        formattedCompanies?.length > 0 && (
          <>
            <TableFromDocuments
              cols={getColumnTitles<ICompanyDocument>(
                formattedCompanies[0],
                TableColumns
              )}
              rows={formattedCompanies}
              resourceBaseUrl="/dashboard/companies"
              apiBaseUrl={COMPANIES_BASE_API_URL}
              refetch={getRows}
            />
            <Pagination
              total={companiesResponse.count}
              limit={limit}
              currentPage={currentPage}
              onClick={handlePageChange}
            />
          </>
        )}
    </>
  );
};

export default AllCompanies;
