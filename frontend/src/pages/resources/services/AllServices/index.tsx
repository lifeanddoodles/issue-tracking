import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IServiceBase,
  IServiceDocument,
} from "../../../../../../shared/interfaces";
import Button from "../../../../components/Button";
import { TextInput } from "../../../../components/Input";
import Pagination from "../../../../components/Pagination";
import usePagination from "../../../../components/Pagination/hooks/usePagination";
import Select from "../../../../components/Select";
import TableFromDocuments from "../../../../components/TableFromDocuments";
import useFetch from "../../../../hooks/useFetch";
import Row from "../../../../layout/Row";
import { SERVICES_BASE_API_URL } from "../../../../routes";
import {
  getColumnTitles,
  getTierOptions,
  objectToQueryString,
} from "../../../../utils";

enum TableColumns {
  name = "Name",
  url = "URL",
  version = "Version",
  tier = "Tier",
}

const AllServices = () => {
  const {
    data: servicesResponse,
    loading,
    error,
    sendRequest,
  } = useFetch<{
    data: IServiceDocument[] | [];
    count: number;
    pagination: { [key: string]: number; limit: number };
    success: boolean;
  }>();
  const services = useMemo(
    () => servicesResponse?.data,
    [servicesResponse?.data]
  );
  const { currentPage, setCurrentPage } = usePagination();
  const limit = 10;

  const [filters, setFilters] = useState<Partial<IServiceBase>>({});
  const [query, setQuery] = useState("");

  const applyFilters: () => void = useCallback(() => {
    const queryString = objectToQueryString<IServiceBase>(filters);
    setQuery(queryString);
  }, [filters]);

  const clearFilters: () => void = useCallback(() => {
    setFilters({});
    setQuery("");
    // TODO: Reset controllers to select empty option
  }, []);

  const getRows = useCallback(() => {
    sendRequest({
      url: `${SERVICES_BASE_API_URL}?page=${currentPage}&limit=${limit}${
        query ? `&${query}` : ""
      }`,
    });
  }, [currentPage, query, sendRequest]);

  const formattedServices = useMemo(
    () =>
      !loading &&
      services?.map((project) => {
        return {
          id: project._id as string,
          data: {
            name: project.name,
            url: project.url,
            version: project.version,
            tier: project.tier,
          },
        };
      }),
    [loading, services]
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
            id="tier"
            value={filters?.tier || ""}
            onChange={handleChangeFilters}
            options={getTierOptions()}
          />
          <TextInput
            id="version"
            onChange={handleChangeFilters}
            value={filters?.version || ""}
          />
        </Row>
        <Row className="gap-2">
          <Button onClick={applyFilters}>Apply filters</Button>
          <Button onClick={clearFilters}>Clear filters</Button>
        </Row>
      </div>
      {loading && <h3 role="status">Loading services...</h3>}
      {!loading && formattedServices && formattedServices?.length === 0 && (
        <h3 role="status">No services found</h3>
      )}
      {!loading &&
        servicesResponse &&
        formattedServices &&
        formattedServices?.length > 0 && (
          <>
            <TableFromDocuments
              cols={getColumnTitles(formattedServices[0], TableColumns)}
              rows={formattedServices}
              resourceBaseUrl="/dashboard/services"
              apiBaseUrl={SERVICES_BASE_API_URL}
              refetch={getRows}
            />
            <Pagination
              total={servicesResponse.count}
              limit={limit}
              currentPage={currentPage}
              onClick={handlePageChange}
            />
          </>
        )}
    </>
  );
};

export default AllServices;
