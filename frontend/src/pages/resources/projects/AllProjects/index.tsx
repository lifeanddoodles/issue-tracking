import { useCallback, useEffect, useMemo, useState } from "react";
import { IProjectDocument } from "../../../../../../shared/interfaces";
import Button from "../../../../components/Button";
import Pagination from "../../../../components/Pagination";
import usePagination from "../../../../components/Pagination/hooks/usePagination";
import SelectWithFetch from "../../../../components/Select/SelectWithFetch";
import TableFromDocuments from "../../../../components/TableFromDocuments";
import useFetch from "../../../../hooks/useFetch";
import Row from "../../../../layout/Row";
import {
  COMPANIES_BASE_API_URL,
  PROJECTS_BASE_API_URL,
} from "../../../../routes";
import {
  getColumnTitles,
  getCompanyDataOptions,
  objectToQueryString,
} from "../../../../utils";

enum TableColumns {
  name = "Name",
  company = "Company",
  url = "URL",
  services = "Services",
}

const AllProjects = () => {
  const {
    data: projectsResponse,
    loading,
    error,
    sendRequest,
  } = useFetch<{
    data:
      | (Omit<IProjectDocument, "company"> & {
          company: {
            _id: Record<string, unknown> | string;
            name: string;
          };
        })[]
      | [];
    count: number;
    pagination: { [key: string]: number; limit: number };
    success: boolean;
  }>();
  const projects = useMemo(
    () => projectsResponse?.data,
    [projectsResponse?.data]
  );
  const { currentPage, setCurrentPage } = usePagination();
  const limit = 10;

  const [filters, setFilters] = useState<
    Partial<{
      name: string;
      company: string;
      url?: string;
      services?: string[];
    }>
  >({});
  const [query, setQuery] = useState("");

  const applyFilters: () => void = useCallback(() => {
    const queryString = objectToQueryString<{
      name: string;
      company: string;
      url?: string;
      services?: string[];
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
      url: `${PROJECTS_BASE_API_URL}?page=${currentPage}&limit=${limit}${
        query ? `&${query}` : ""
      }`,
    });
  }, [currentPage, query, sendRequest]);

  const formattedProjects = useMemo(
    () =>
      !loading &&
      projects?.map((project) => {
        return {
          id: project._id as string,
          data: {
            name: project.name,
            company: project.company?.name,
            url: project.url,
            services: project.services,
          },
        };
      }),
    [loading, projects]
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
          <SelectWithFetch
            id="company"
            value={filters.company || ""}
            onChange={handleChangeFilters}
            url={COMPANIES_BASE_API_URL}
            getFormattedOptions={getCompanyDataOptions}
          />
        </Row>
        <Row className="gap-2">
          <Button onClick={applyFilters}>Apply filters</Button>
          <Button onClick={clearFilters}>Clear filters</Button>
        </Row>
      </div>
      {loading && <h3 role="status">Loading projects...</h3>}
      {!loading && formattedProjects && formattedProjects?.length === 0 && (
        <h3 role="status">No projects found</h3>
      )}
      {!loading &&
        projectsResponse &&
        formattedProjects &&
        formattedProjects?.length > 0 && (
          <>
            <TableFromDocuments
              cols={getColumnTitles(formattedProjects[0], TableColumns)}
              rows={formattedProjects}
              resourceBaseUrl="/dashboard/projects"
              apiBaseUrl={PROJECTS_BASE_API_URL}
              refetch={getRows}
            />
            <Pagination
              total={projectsResponse.count}
              limit={limit}
              currentPage={currentPage}
              onClick={handlePageChange}
            />
          </>
        )}
    </>
  );
};

export default AllProjects;
