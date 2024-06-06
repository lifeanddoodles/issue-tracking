import { useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  IAddressInfo,
  ICompanyDocument,
  Industry,
  SubscriptionStatus,
  Tier,
  UserRole,
} from "../../../../../../shared/interfaces";
import FieldWrapperWithLinkFallback from "../../../../components/FieldWrapperWithLinkFallback";
import { EmailInput, TextInput, UrlInput } from "../../../../components/Input";
import Select from "../../../../components/Select";
import SelectWithFetch from "../../../../components/Select/SelectWithFetch";
import TextArea from "../../../../components/TextArea";
import UpdatableDetailsForm from "../../../../components/UpdatableDetailsForm";
import { useAuthContext } from "../../../../context/AuthProvider";
import { FormElement, FormField } from "../../../../interfaces";
import { COMPANIES_BASE_API_URL, USERS_BASE_API_URL } from "../../../../routes";
import {
  getCustomerSuccessOptions,
  getIndustryOptions,
  getResourceId,
  getSubscriptionStatusOptions,
  getTierOptions,
  getUserDataOptions,
  userIsAuthorized,
  userNotAuthorized,
} from "../../../../utils";

type CompanyFormData = Partial<
  ICompanyDocument & {
    newEmployee?: string;
  }
>;

const isFieldDisabled = (id: string, formData: CompanyFormData) => {
  switch (id) {
    case "assignedRepresentative":
      return formData?.tier === ("" as Tier) || formData.tier === Tier.FREE;
    default:
      return;
  }
};

const fields = [
  {
    Component: TextInput,
    label: "Name:",
    id: "name",
    required: true,
  },
  {
    Component: Select,
    label: "Status:",
    id: "subscriptionStatus",
    required: true,
    fieldProps: {
      options: getSubscriptionStatusOptions,
    },
  },
  {
    Component: Select,
    label: "Tier:",
    id: "tier",
    permissions: {
      VIEW: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF],
    },
    fieldProps: {
      options: getTierOptions,
    },
  },
  {
    Component: EmailInput,
    label: "Email:",
    id: "email",
  },
  {
    Component: UrlInput,
    label: "URL:",
    id: "url",
    required: true,
  },
  {
    Component: TextInput,
    label: "Phone:",
    id: "phone",
  },
  {
    Component: TextInput,
    label: "Street:",
    id: "address.street",
  },
  {
    Component: TextInput,
    label: "City:",
    id: "address.city",
  },
  {
    Component: TextInput,
    label: "State:",
    id: "address.state",
  },
  {
    Component: TextInput,
    label: "Zip:",
    id: "address.zip",
  },
  {
    Component: TextInput,
    label: "Country:",
    id: "address.country",
  },
  {
    Component: TextInput,
    label: "DBA:",
    id: "dba",
  },
  {
    Component: Select,
    label: "Industry:",
    id: "industry",
    fieldProps: {
      options: getIndustryOptions,
    },
  },
  {
    Component: TextArea,
    label: "Description:",
    id: "description",
    required: true,
  },
  {
    Component: SelectWithFetch,
    label: "Add employee:",
    id: "newEmployee",
    permissions: {
      VIEW: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF],
      EDIT: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF],
    },
    fieldProps: {
      url: USERS_BASE_API_URL,
      getFormattedOptions: getUserDataOptions,
      showList: true,
      pathToValue: "employees",
    },
    wrapperProps: {
      Wrapper: FieldWrapperWithLinkFallback,
      getResourceId,
      resourceName: "user",
      uiResourceBaseUrl: "/dashboard/users",
      disableToggleEdit: userNotAuthorized,
      forceVisible: userIsAuthorized,
      secondaryLabels: {
        create: "Add team member",
        edit: "Edit team member",
      },
    },
  },
  {
    Component: SelectWithFetch,
    label: "Assign representative:",
    id: "assignedRepresentative",
    permissions: {
      VIEW: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF],
    },
    fieldProps: {
      url: USERS_BASE_API_URL,
      getFormattedOptions: getCustomerSuccessOptions,
    },
    wrapperProps: {
      disableToggleEdit: isFieldDisabled,
    },
  },
];

const CompanyDetails = () => {
  const params = useParams();
  const { user } = useAuthContext();
  const companyId = params.companyId || user?.company;
  const formShape = {
    name: "",
    subscriptionStatus: "" as SubscriptionStatus,
    tier: "",
    url: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    dba: "",
    industry: "" as Industry,
    description: "",
    employees: [] as (Record<string, unknown> | string)[],
    newEmployee: "",
    assignedRepresentative: "",
  };

  const handleChange = useCallback(
    (target: FormElement, updatedFormData: CompanyFormData) => {
      let newFormData = { ...updatedFormData };

      // Check if the target name starts with 'address.'
      if (target.name.startsWith("address.")) {
        // This is an address property
        // Fix its name, update the correct property inside address
        const addressKey = target.name.replace("address.", "");

        newFormData = {
          ...newFormData,
          address: {
            ...(newFormData.address || {}),
            [addressKey as keyof IAddressInfo]: target.value,
          } as IAddressInfo,
        };
      } else if (target.name === "newEmployee") {
        newFormData[target.name as keyof ICompanyDocument] = target.value;
        newFormData.employees = [
          ...(newFormData?.employees || []),
          target.value,
        ];
      } else {
        // This is not an edge case, update the main object
        newFormData[target.name as keyof ICompanyDocument] =
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
      resourceUrl={COMPANIES_BASE_API_URL}
      resourceId={companyId as string}
      resourceName={"company"}
      onChange={handleChange}
      formShape={formShape}
      fields={fields as FormField<unknown>[]}
      userRole={user?.role as UserRole}
    />
  );
};

export default CompanyDetails;
