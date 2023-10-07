import { ICompanyDocument } from "shared/interfaces";
import TableFromDocuments from "../../../components/TableFromDocuments";
import useFetch from "../../../hooks/useFetch";
import { COMPANIES_BASE_API_URL } from "../../../routes";
import { getColumnTitles } from "../../../utils";

enum TableColumns {
  name = "Name",
  url = "URL",
  subscriptionStatus = "Status",
  industry = "Industry",
}

const AllCompanies = () => {
  const {
    data: companies,
    loading,
    error,
  } = useFetch<ICompanyDocument[] | []>({
    url: COMPANIES_BASE_API_URL,
  });
  const formattedCompanies = companies?.map((company) => {
    return {
      id: company._id.toString(),
      data: {
        name: company.name,
        subscriptionStatus: company.subscriptionStatus,
        url: company.url,
        industry: company.industry,
      },
    };
  });

  {
    loading && <h3 role="status">Loading companies...</h3>;
  }
  {
    error && <h3 role="status">{error.message}</h3>;
  }
  {
    !loading && formattedCompanies && formattedCompanies?.length === 0 && (
      <h3 role="status">No companies data found</h3>
    );
  }
  return (
    !loading &&
    formattedCompanies &&
    formattedCompanies?.length > 0 && (
      <TableFromDocuments
        cols={getColumnTitles<ICompanyDocument>(
          formattedCompanies[0],
          TableColumns
        )}
        rows={formattedCompanies}
        resourceBaseUrl="/dashboard/companies"
      />
    )
  );
};

export default AllCompanies;
