import { useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  DepartmentTeam,
  IUserDocument,
  UserRole,
} from "../../../../../../shared/interfaces";
import FieldWrapperWithLinkFallback from "../../../../components/FieldWrapperWithLinkFallback";
import { EmailInput, TextInput } from "../../../../components/Input";
import Select from "../../../../components/Select";
import SelectWithFetch from "../../../../components/Select/SelectWithFetch";
import UpdatableDetailsForm from "../../../../components/UpdatableDetailsForm";
import { useAuthContext } from "../../../../context/AuthProvider";
import { FormElement } from "../../../../interfaces";
import { COMPANIES_BASE_API_URL, USERS_BASE_API_URL } from "../../../../routes";
import {
  getCompanyDataOptions,
  getDepartmentTeamOptions,
  getResourceId,
  userNotAuthorized,
} from "../../../../utils";

type UserFormData = Partial<IUserDocument> & { newAssignedAccount?: string };

const fields = [
  {
    Component: TextInput,
    label: "First name:",
    id: "firstName",
    required: true,
  },
  {
    Component: TextInput,
    label: "Last name:",
    id: "lastName",
    required: true,
  },
  {
    Component: EmailInput,
    label: "Email:",
    id: "email",
    required: true,
  },
  {
    Component: TextInput,
    label: "Position:",
    id: "position",
    required: true,
  },
  {
    Component: SelectWithFetch,
    label: "Company:",
    id: "company",
    permissions: {
      EDIT: [UserRole.ADMIN, UserRole.STAFF, UserRole.DEVELOPER],
    },
    fieldProps: {
      url: COMPANIES_BASE_API_URL,
      getFormattedOptions: getCompanyDataOptions,
    },
    wrapperProps: {
      Wrapper: FieldWrapperWithLinkFallback,
      getResourceId,
      resourceName: "company",
      uiResourceBaseUrl: "/dashboard/companies",
      disableToggleEdit: userNotAuthorized,
    },
  },
  {
    Component: Select,
    label: "Department:",
    id: "department",
    required: true,
    fieldProps: {
      options: getDepartmentTeamOptions,
    },
  },
  {
    Component: SelectWithFetch,
    label: "Assign account:",
    id: "newAssignedAccount",
    permissions: { VIEW: [UserRole.ADMIN, UserRole.STAFF, UserRole.DEVELOPER] },
    fieldProps: {
      url: COMPANIES_BASE_API_URL,
      getFormattedOptions: getCompanyDataOptions,
      showList: true,
      pathToValue: "assignedAccounts",
    },
  },
];

const UserDetails = () => {
  const params = useParams();
  const userId = params.userId;
  const { user } = useAuthContext();

  const formShape: UserFormData = {
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    department: "" as DepartmentTeam,
    position: "",
    newAssignedAccount: "",
    assignedAccounts: [],
  };

  const handleChange = useCallback(
    (target: FormElement, updatedFormData: UserFormData) => {
      const newFormData = { ...updatedFormData };

      if (target.name === "newAssignedAccount") {
        newFormData[target.name] = target.value;
        newFormData.assignedAccounts = [
          ...(newFormData?.assignedAccounts || []),
          target.value,
        ];
      } else {
        newFormData[target.name as keyof IUserDocument] =
          target.type === "checkbox"
            ? (target as HTMLInputElement).checked
            : target.value !== "" && target.value
            ? target.value
            : null;
      }

      return newFormData;
    },
    []
  );

  return (
    <UpdatableDetailsForm
      resourceUrl={USERS_BASE_API_URL}
      resourceId={userId as string}
      resourceName={"user"}
      onChange={handleChange}
      formShape={formShape}
      fields={fields}
      userRole={user?.role as UserRole}
    />
  );
};

export default UserDetails;
