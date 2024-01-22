import { FormElement } from "frontend/src/interfaces";
import { ObjectId } from "mongoose";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  IAddressInfo,
  ICompanyDocument,
  Industry,
  SubscriptionStatus,
} from "../../../../../../shared/interfaces";
import { EmailInput, TextInput, UrlInput } from "../../../../components/Input";
import Select from "../../../../components/Select";
import SelectWithFetch from "../../../../components/Select/SelectWithFetch";
import TextArea from "../../../../components/TextArea";
import UpdatableResourceForm from "../../../../components/UpdatableResourceForm";
import { useAuthContext } from "../../../../context/AuthProvider";
import { COMPANIES_BASE_API_URL, USERS_BASE_API_URL } from "../../../../routes";
import {
  getIndustryOptions,
  getSubscriptionStatusOptions,
  getUserDataOptions,
} from "../../../../utils";

type PartialDocument = Partial<ICompanyDocument> & {
  newEmployee?: ObjectId | Record<string, unknown>;
};

interface ICompanyDetailsFormProps {
  resourceUrl: string;
  resourceId: string;
  resourceName: string;
  onChange: (
    target: FormElement,
    updates: Partial<ICompanyDocument>
  ) => Partial<ICompanyDocument>;
  formShape: Partial<ICompanyDocument> & {
    newEmployee?: string;
  };
}

const CompanyDetailsForm = ({
  resourceUrl,
  resourceId,
  resourceName,
  onChange,
  formShape,
}: ICompanyDetailsFormProps) => {
  return (
    <UpdatableResourceForm
      resourceUrl={resourceUrl}
      resourceId={resourceId}
      resourceName={resourceName}
      onChange={onChange}
      formShape={formShape}
    >
      <TextInput label="Name:" id="name" required value={formShape?.name} />
      <Select
        label="Status:"
        id="subscriptionStatus"
        options={getSubscriptionStatusOptions()}
        required
        value={formShape?.subscriptionStatus}
      />
      <EmailInput label="Email:" id="email" required value={formShape?.email} />
      <UrlInput label="URL:" id="url" required value={formShape?.url} />
      <TextInput label="Phone:" id="phone" value={formShape?.phone} />
      <TextInput
        label="Street:"
        id="address.street"
        value={formShape?.address?.street}
      />
      <TextInput
        label="City:"
        id="address.city"
        value={formShape?.address?.city}
      />
      <TextInput
        label="State:"
        id="address.state"
        value={formShape?.address?.state}
      />
      <TextInput
        label="Zip:"
        id="address.zip"
        value={formShape?.address?.zip}
      />
      <TextInput
        label="Country:"
        id="address.country"
        value={formShape?.address?.country}
      />
      <TextInput label="DBA:" id="dba" value={formShape?.dba} />
      <Select
        label="Industry:"
        id="industry"
        options={getIndustryOptions()}
        value={formShape?.industry}
      />
      <TextArea
        label="Description:"
        id="description"
        value={formShape?.description}
      />
      <SelectWithFetch
        label="Add employee:"
        id="newEmployee"
        value={formShape?.newEmployee as string}
        url={USERS_BASE_API_URL}
        getFormattedOptions={getUserDataOptions}
        showList={true}
        pathToValue={"employees"}
      />
    </UpdatableResourceForm>
  );
};

const CompanyDetails = () => {
  const params = useParams();
  const { user } = useAuthContext();
  const companyId = params.companyId || user?.company;
  const formShape = {
    name: "",
    subscriptionStatus: "" as SubscriptionStatus,
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
    employees: [] as (ObjectId | Record<string, unknown> | string)[],
    newEmployee: "",
  };

  const handleChange = useCallback(
    (target: FormElement, updatedFormData: PartialDocument) => {
      const newFormData = { ...updatedFormData };

      // Check if the target name starts with 'address.'
      if (target.name.startsWith("address.")) {
        // This is an address property
        // Fix its name, update the correct property inside address
        const addressKey = target.name.replace("address.", "");

        updatedFormData = {
          ...updatedFormData,
          address: {
            ...(updatedFormData.address || {}),
            [addressKey as keyof IAddressInfo]: target.value,
          } as IAddressInfo,
        };
      } else if (target.name === "newEmployee") {
        newFormData[target.name as keyof ICompanyDocument] = target.value;
        newFormData.employees = [
          ...(newFormData?.employees || []),
          target.value as unknown as ObjectId | Record<string, unknown>,
        ];
      } else {
        // This is not an address property, update the main object
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
    <>
      <CompanyDetailsForm
        resourceUrl={COMPANIES_BASE_API_URL}
        resourceId={companyId as string}
        resourceName={"company"}
        onChange={handleChange}
        formShape={formShape}
      />
    </>
  );
};

export default CompanyDetails;
