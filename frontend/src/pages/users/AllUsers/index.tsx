import { useCallback, useEffect, useState } from "react";
import { IUser, IUserDocument } from "shared/interfaces";
import Button from "../../../components/Button";
import Select from "../../../components/Select";
import TableFromDocuments from "../../../components/TableFromDocuments";
import useFetch from "../../../hooks/useFetch";
import Row from "../../../layout/Row";
import { USERS_BASE_API_URL } from "../../../routes";
import {
  getColumnTitles,
  getDepartmentTeamOptions,
  getUserRoleOptions,
  objectToQueryString,
} from "../../../utils";

enum TableColumns {
  firstName = "First Name",
  lastName = "Last Name",
  email = "Email",
  company = "Company",
  position = "Position",
  role = "Role",
  department = "Department",
}

const AllUsers = () => {
  const {
    data: users,
    loading,
    error,
    sendRequest,
  } = useFetch<IUserDocument[] | []>();
  const [filters, setFilters] = useState<Partial<IUser>>({});
  const [query, setQuery] = useState("");

  const applyFilters: () => void = useCallback(() => {
    const queryString = objectToQueryString<Partial<IUser>>(filters);
    setQuery(queryString);
  }, [filters]);

  const clearFilters: () => void = useCallback(() => {
    setFilters({});
    setQuery("");
    // TODO: Reset controllers to select empty option
  }, []);

  const getRows = useCallback(() => {
    sendRequest({
      url: `${USERS_BASE_API_URL}${query ? `?${query}` : ""}`,
    });
  }, [query, sendRequest]);

  useEffect(() => {
    getRows();
  }, [getRows]);

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

  const formattedUsers =
    !loading &&
    users &&
    users?.map((user) => {
      return {
        id: user._id.toString(),
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          company: user.company,
          position: user.position,
          role: user.role,
          department: user.department,
        },
      };
    });

  if (error) return <h1 role="status">{error.message}</h1>;

  return (
    <>
      <div className="filters mb-8">
        <Row className="gap-2">
          <Select
            id="department"
            value={filters?.department || ""}
            options={getDepartmentTeamOptions("Department")}
            onChange={handleChangeFilters}
            direction="col"
            className="shrink-0 grow max-w-[10rem]"
          />
          <Select
            id="role"
            value={filters?.role || ""}
            options={getUserRoleOptions("Role")}
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
      {loading && <h1 role="status">Loading users...</h1>}
      {!loading && formattedUsers && formattedUsers?.length === 0 && (
        <h1 role="status">No users found</h1>
      )}
      {!loading && formattedUsers && formattedUsers?.length > 0 && (
        <TableFromDocuments
          cols={getColumnTitles(formattedUsers[0], TableColumns)}
          rows={formattedUsers}
          resourceBaseUrl="/dashboard/users"
          apiBaseUrl={USERS_BASE_API_URL}
          refetch={getRows}
        />
      )}
    </>
  );
};

export default AllUsers;
