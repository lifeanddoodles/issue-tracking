import { useCallback, useEffect, useState } from "react";
import { IProjectDocument } from "../../../../../shared/interfaces";
import Button from "../../../components/Button";
import TableFromDocuments from "../../../components/TableFromDocuments";
import useAuth from "../../../hooks/useAuth";
import useFetch from "../../../hooks/useFetch";
import Row from "../../../layout/Row";
import { PROJECTS_BASE_API_URL } from "../../../routes";
import { getColumnTitles, objectToQueryString } from "../../../utils";

enum TableColumns {
  name = "Name",
  company = "Company",
  url = "URL",
  services = "Services",
}

const ProjectsByCompany = () => {
  const { user } = useAuth();
  const companyId = user?.company!.toString();
  const {
    data: projects,
    loading,
    error,
    sendRequest,
  } = useFetch<IProjectDocument[] | []>();
  const [filters, setFilters] = useState<
    Partial<{
      name: string;
      url?: string;
      services?: string[];
    }>
  >({});
  const [query, setQuery] = useState(``);

  const applyFilters: () => void = useCallback(() => {
    const queryString = objectToQueryString<
      Partial<{
        name: string;
        url?: string;
        services?: string[];
      }>
    >(filters);
    setQuery(queryString);
  }, [filters]);

  const clearFilters: () => void = useCallback(() => {
    setFilters({});
    setQuery("");
    // TODO: Reset controllers to select empty option
  }, []);

  const getRows = useCallback(() => {
    sendRequest({
      url: `${PROJECTS_BASE_API_URL}?company=${companyId}${
        query ? `&${query}` : ""
      }`,
    });
  }, [companyId, query, sendRequest]);

  useEffect(() => {
    getRows();
  }, [getRows]);

  const formattedProjects =
    !loading &&
    projects?.map((project) => {
      return {
        id: project._id.toString(),
        data: {
          name: project.name,
          company: project.company,
          url: project.url,
          services: project.services,
        },
      };
    });

  if (error) return <h3 role="status">{error.message}</h3>;

  return (
    <>
      <div className="filters mb-8">
        <Row className="gap-2">
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
      {!loading && formattedProjects && formattedProjects?.length > 0 && (
        <TableFromDocuments
          cols={getColumnTitles(formattedProjects[0], TableColumns)}
          rows={formattedProjects}
          resourceBaseUrl="/dashboard/projects"
          apiBaseUrl={PROJECTS_BASE_API_URL}
          refetch={getRows}
        />
      )}
    </>
  );
};

export default ProjectsByCompany;
