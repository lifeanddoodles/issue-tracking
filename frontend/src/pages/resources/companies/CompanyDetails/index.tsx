import { ObjectId } from "mongoose";
import { useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  IAddressInfo,
  ICompanyDocument,
  SubscriptionStatus,
} from "../../../../../../shared/interfaces";
import Button from "../../../../components/Button";
import FormControlWithActions from "../../../../components/FormControlWithActions";
import Heading from "../../../../components/Heading";
import { EmailInput, TextInput, UrlInput } from "../../../../components/Input";
import Select from "../../../../components/Select";
import SelectWithFetch from "../../../../components/Select/SelectWithFetch";
import TextArea from "../../../../components/TextArea";
import { useAuthContext } from "../../../../context/AuthProvider";
import useForm from "../../../../hooks/useForm";
import useResourceInfo from "../../../../hooks/useResourceInfo";
import useValidation from "../../../../hooks/useValidation";
import { COMPANIES_BASE_API_URL, USERS_BASE_API_URL } from "../../../../routes";
import {
  getIndustryOptions,
  getSubscriptionStatusOptions,
  getUserDataOptions,
  isEmpty,
} from "../../../../utils";

type PartialDocument = Partial<ICompanyDocument> & {
  newEmployee?: ObjectId | Record<string, unknown>;
};

const CompanyDetails = () => {
  const params = useParams();
  const { user } = useAuthContext();
  const companyId = params.companyId || user?.company;
  const {
    data: company,
    loading,
    error,
    requestGetResource,
    requestUpdateResource,
    requestDeleteResource,
  } = useResourceInfo<ICompanyDocument | null>();
  const { validateField } = useValidation();
  const formDataShape: PartialDocument = useMemo(
    () =>
      company
        ? {
            name: company?.name ?? ("" as string),
            subscriptionStatus:
              company?.subscriptionStatus || ("" as SubscriptionStatus),
            url: company?.url,
            email: company?.email,
            phone: company?.phone,
            address: {
              street: company?.address?.street || "",
              city: company?.address?.city || "",
              state: company?.address?.state || "",
              zip: company?.address?.zip || "",
              country: company?.address?.country || "",
            },
            dba: company?.dba,
            industry: company?.industry,
            description: company?.description,
            employees: company?.employees,
            newEmployee: undefined,
          }
        : {},
    [company]
  );
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    setInitialFormData,
    changedFormData,
  } = useForm<PartialDocument, ICompanyDocument>({
    formShape: formDataShape,
  });

  const getCompanyInfo = useCallback(async () => {
    await requestGetResource({
      url: `${COMPANIES_BASE_API_URL}/${companyId}`,
    });
  }, [companyId, requestGetResource]);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const target = e.target;

      setFormData((prevFormData) => {
        // Clone the previous data to avoid mutations
        const updatedFormData: Partial<ICompanyDocument> = { ...prevFormData };

        // Check if the target name starts with 'address.'
        if (target.name.startsWith("address.")) {
          // This is an address property
          // Fix its name, update the correct property inside address
          const addressKey = target.name.replace("address.", "");

          if (!updatedFormData.address) {
            updatedFormData.address = {
              street: "",
              city: "",
              state: "",
              zip: "",
              country: "",
            };
          }

          updatedFormData.address[addressKey as keyof IAddressInfo] =
            target.value;
        } else if (target.name === "newEmployee") {
          updatedFormData[target.name as keyof ICompanyDocument] = target.value;
          updatedFormData.employees = [
            ...(updatedFormData?.employees || []),
            target.value as unknown as ObjectId | Record<string, unknown>,
          ];
        } else {
          // This is not an address property, update the main object
          updatedFormData[target.name as keyof ICompanyDocument] =
            target.type === "checkbox"
              ? (target as HTMLInputElement).checked
              : target.value !== "" && target.value
              ? target.value
              : null;
        }
        return updatedFormData;
      });

      validateField({
        target,
        setErrors,
      });
    },
    [setErrors, setFormData, validateField]
  );

  const handleCancel = useCallback(
    (
      target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
      initialValue:
        | string
        | number
        | boolean
        | readonly string[]
        | ObjectId
        | Record<string, unknown>
    ) => {
      setFormData({
        ...formData!,
        [target.id]: initialValue,
      });
    },
    [formData, setFormData]
  );

  const handleSave = useCallback(async () => {
    const options = getUpdateOptions(changedFormData);
    await requestUpdateResource({
      url: `${COMPANIES_BASE_API_URL}/${companyId}`,
      body: changedFormData,
    });
    getCompanyInfo();
  }, [changedFormData, companyId, getCompanyInfo, requestUpdateResource]);

  const handleDelete = useCallback(async () => {
    await requestDeleteResource({
      url: `${COMPANIES_BASE_API_URL}/${companyId}`,
    });
  }, [companyId, requestDeleteResource]);

  useEffect(() => {
    const fetchData = async () => {
      await getCompanyInfo();
    };

    fetchData();
  }, [getCompanyInfo]);

  useEffect(() => {
    // Update initialFormData when company changes
    if (company) {
      const updates: PartialDocument = {
        name: company?.name ?? "",
        subscriptionStatus: company?.subscriptionStatus || "",
        url: company?.url,
        email: company?.email,
        phone: company?.phone,
        address: {
          street: company?.address?.street || "",
          city: company?.address?.city || "",
          state: company?.address?.state || "",
          zip: company?.address?.zip || "",
          country: company?.address?.country || "",
        },
        dba: company?.dba,
        industry: company?.industry,
        description: company?.description,
        employees: company?.employees,
        newEmployee: undefined,
      };

      setInitialFormData(updates);
    }
  }, [company, setInitialFormData]);

  if (loading) {
    return <Heading text="Loading..." level={1} role="status" />;
  }

  if (error) {
    return <Heading text={error.message} level={1} role="status" />;
  }

  if (!company) {
    return <Heading text="Company not found" level={1} role="status" />;
  }

  return (
    formData &&
    !isEmpty(formData) &&
    company && (
      <div className="company-details flex flex-col align-stretch">
        <div className="company-details__actions self-end flex gap-4">
          <Button onClick={handleDelete}>Delete</Button>
        </div>
        <Heading text="Company Details" level={1} />
        <FormControlWithActions
          label="Name:"
          id="name"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData?.name}
          required
          errors={errors}
          setErrors={setErrors}
          component={TextInput}
        />
        <FormControlWithActions
          label="Status:"
          id="subscriptionStatus"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData?.subscriptionStatus as SubscriptionStatus}
          options={getSubscriptionStatusOptions()}
          required
          errors={errors}
          setErrors={setErrors}
          component={Select}
        />
        <FormControlWithActions
          label="Email:"
          id="email"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData?.email}
          required
          errors={errors}
          setErrors={setErrors}
          component={EmailInput}
        />
        <FormControlWithActions
          label="URL:"
          id="url"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData?.url}
          required
          errors={errors}
          setErrors={setErrors}
          component={UrlInput}
        />
        <FormControlWithActions
          label="Phone:"
          id="phone"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData.phone}
          errors={errors}
          setErrors={setErrors}
          component={TextInput}
        />
        <FormControlWithActions
          label="Street:"
          id="address.street"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData.address?.street}
          errors={errors}
          setErrors={setErrors}
          component={TextInput}
        />
        <FormControlWithActions
          label="City:"
          id="address.city"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData.address?.city}
          errors={errors}
          setErrors={setErrors}
          component={TextInput}
        />
        <FormControlWithActions
          label="State:"
          id="address.state"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData.address?.state}
          errors={errors}
          setErrors={setErrors}
          component={TextInput}
        />
        <FormControlWithActions
          label="Zip:"
          id="address.zip"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData.address?.zip}
          errors={errors}
          setErrors={setErrors}
          component={TextInput}
        />
        <FormControlWithActions
          label="Country:"
          id="address.country"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData.address?.country}
          errors={errors}
          setErrors={setErrors}
          component={TextInput}
        />
        <FormControlWithActions
          label="DBA:"
          id="dba"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData.dba}
          errors={errors}
          setErrors={setErrors}
          component={TextInput}
        />
        <FormControlWithActions
          label="Industry:"
          id="industry"
          value={formData?.industry}
          options={getIndustryOptions()}
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          errors={errors}
          setErrors={setErrors}
          component={Select}
        />
        <FormControlWithActions
          label="Description:"
          id="description"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData.description}
          errors={errors}
          setErrors={setErrors}
          component={TextArea}
        />
        <FormControlWithActions
          label="Add employee:"
          id="newEmployee"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData?.newEmployee}
          url={USERS_BASE_API_URL}
          getFormattedOptions={getUserDataOptions}
          errors={errors}
          setErrors={setErrors}
          component={SelectWithFetch}
          showList={true}
          currentList={formData?.employees}
        />
      </div>
    )
  );
};

export default CompanyDetails;
