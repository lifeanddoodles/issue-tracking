import { Schema } from "mongoose";
import { useCallback, useEffect, useState } from "react";
import {
  IProjectDocument,
  IServiceDocument,
} from "../../../../../../shared/interfaces";
import Button from "../../../../components/Button";
import Select from "../../../../components/Select";
import TableFromDocuments from "../../../../components/TableFromDocuments";
import { useAuthContext } from "../../../../context/AuthProvider";
import useFetch from "../../../../hooks/useFetch";
import Row from "../../../../layout/Row";
import {
  PROJECTS_BASE_API_URL,
  SERVICES_BASE_API_URL,
} from "../../../../routes";
import {
  getColumnTitles,
  getServiceDataOptions,
  objectToQueryString,
} from "../../../../utils";

enum TableColumns {
  name = "Name",
  company = "Company",
  url = "URL",
  services = "Services",
}

type PopulatedCompany = {
  _id: Schema.Types.ObjectId | string;
  name: string;
  id: string;
};

interface IProjectDocumentPopulated extends Omit<IProjectDocument, "company"> {
  company: PopulatedCompany;
}

const useServicesFetch = () => {
  const { data, loading, error, sendRequest } = useFetch<
    IServiceDocument[] | []
  >();

  const getServices = useCallback(async () => {
    await sendRequest({
      url: SERVICES_BASE_API_URL,
    });
  }, [sendRequest]);

  return { data, loading, error, getServices };
};

const useProjectsFetch = () => {
  const { data, loading, error, sendRequest } = useFetch<
    IProjectDocumentPopulated[] | []
  >();

  const getProjectsRows = useCallback(
    async (companyId?: string, query?: string) => {
      await sendRequest({
        url: `${PROJECTS_BASE_API_URL}${companyId || query ? "?" : ""}${
          companyId ? `company=${companyId}` : ""
        }${query ? `&${query}` : ""}`,
      });
    },
    [sendRequest]
  );

  return { data, loading, error, getProjectsRows };
};

const ProjectsByCompany = () => {
  const { user } = useAuthContext();
  const companyId = user?.company?.toString();
  const {
    data: services,
    loading: servicesLoading,
    getServices,
  } = useServicesFetch();
  const {
    data: projects,
    loading: projectsLoading,
    error: projectsError,
    getProjectsRows,
  } = useProjectsFetch();
  const [filters, setFilters] = useState<
    Partial<{
      name: string;
      url?: string;
      service?: string;
    }>
  >({});
  const [query, setQuery] = useState(``);

  const getRows = useCallback(async () => {
    getProjectsRows(companyId, query);
  }, [companyId, getProjectsRows, query]);

  const applyFilters: () => void = useCallback(() => {
    const queryString = objectToQueryString<
      Partial<{
        name: string;
        url?: string;
        service?: string;
      }>
    >(filters);
    setQuery(queryString);
  }, [filters]);

  const clearFilters: () => void = useCallback(() => {
    setFilters({});
    setQuery("");
    // TODO: Reset controllers to select empty option
  }, []);

  const handleChangeFilters = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    getServices();
  }, [getServices]);

  useEffect(() => {
    getRows();
  }, [getRows]);

  const formattedProjects = projects?.map((project) => {
    return {
      id: project._id.toString(),
      data: {
        name: project.name,
        company: project.company.name,
        url: project.url,
        services: project.services,
      },
    };
  });

  if (projectsError) return <h3 role="status">{projectsError.message}</h3>;

  return (
    <>
      <div className="filters mb-8">
        <Row className="gap-2">
          {servicesLoading && <p role="status">Loading services...</p>}
          {services && (
            <Select
              id="services"
              value={filters?.service}
              options={getServiceDataOptions(services)}
              onChange={handleChangeFilters}
            />
          )}
        </Row>
        <Row className="gap-2">
          <Button onClick={applyFilters}>Apply filters</Button>
          <Button onClick={clearFilters}>Clear filters</Button>
        </Row>
      </div>
      {projectsLoading && <h3 role="status">Loading projects...</h3>}
      {!projectsLoading &&
        formattedProjects &&
        formattedProjects?.length === 0 && (
          <h3 role="status">No projects found</h3>
        )}
      {!projectsLoading &&
        formattedProjects &&
        formattedProjects?.length > 0 && (
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
