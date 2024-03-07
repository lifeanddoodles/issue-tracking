import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { IUserDocument, UserRole } from "../../../../../../shared/interfaces";
import FieldWrapperWithLinkFallback from "../../../../components/FieldWrapperWithLinkFallback";
import { EmailInput, TextInput } from "../../../../components/Input";
import Select from "../../../../components/Select";
import UpdatableDetailsForm from "../../../../components/UpdatableDetailsForm";
import { useAuthContext } from "../../../../context/AuthProvider";
import { FormElement } from "../../../../interfaces";
import { USERS_BASE_API_URL } from "../../../../routes";
import {
  getDepartmentTeamOptions,
  getResourceId,
  userNotAuthorized,
} from "../../../../utils";

type UserFormData = Partial<IUserDocument>;

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
    Component: Select,
    label: "Department:",
    id: "department",
    required: true,
    fieldProps: {
      options: getDepartmentTeamOptions,
    },
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
    /*
     * TODO: Add SelectWithFetch for company field
     * Modify the Option component's props to show company name instead of ID
     */
    Component: TextInput,
    label: "Company:",
    id: "company",
    wrapperProps: {
      Wrapper: FieldWrapperWithLinkFallback,
      getResourceId,
      resourceName: "company",
      uiResourceBaseUrl: "/dashboard/companies",
      disableToggleEdit: userNotAuthorized,
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
    position: "",
  };

  const handleChange = useCallback(
    (target: FormElement, updatedFormData: UserFormData) => {
      const newFormData = { ...updatedFormData };

      newFormData[target.name as keyof IUserDocument] =
        target.type === "checkbox"
          ? (target as HTMLInputElement).checked
          : target.value !== "" && target.value
          ? target.value
          : null;

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
