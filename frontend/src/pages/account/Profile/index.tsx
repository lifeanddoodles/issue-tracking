import { useCallback, useEffect } from "react";
import {
  DepartmentTeam,
  IUserDocument,
  UserRole,
} from "../../../../../shared/interfaces";
import FieldWrapperWithLinkFallback from "../../../components/FieldWrapperWithLinkFallback";
import Heading from "../../../components/Heading";
import { EmailInput, TextInput } from "../../../components/Input";
import Select from "../../../components/Select";
import UpdatableDetailsForm from "../../../components/UpdatableDetailsForm";
import useProfileData from "../../../hooks/useProfileData";
import { FormElement } from "../../../interfaces";
import { USERS_BASE_API_URL } from "../../../routes";
import {
  getDepartmentTeamOptions,
  getResourceId,
  userNotAuthorized,
} from "../../../utils";

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
    Component: Select,
    label: "Department:",
    id: "department",
    required: true,
    fieldProps: {
      options: getDepartmentTeamOptions,
    },
  },
  {
    Component: TextInput,
    label: "Company:",
    id: "company",
    permissions: {
      EDIT: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF],
    },
    wrapperProps: {
      Wrapper: FieldWrapperWithLinkFallback,
      getResourceId,
      resourceName: "company",
      uiResourceBaseUrl: "/dashboard/companies",
      disableToggleEdit: userNotAuthorized,
    },
  },
];

const Profile = () => {
  const { userInfo, error, getUserInfo } = useProfileData();
  const formShape: UserFormData = {
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    department: "" as DepartmentTeam,
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

  useEffect(() => {
    if (!userInfo) {
      getUserInfo();
    }
  }, [getUserInfo, userInfo]);

  if (error) {
    return <Heading text={error.message} level={1} role="status" />;
  }

  return (
    userInfo !== null && (
      <UpdatableDetailsForm
        resourceUrl={USERS_BASE_API_URL}
        resourceId={userInfo?._id as string}
        resourceName={"user"}
        onChange={handleChange}
        formShape={formShape}
        fields={fields}
        userRole={userInfo?.role as UserRole}
        title="Profile"
      />
    )
  );
};

export default Profile;
