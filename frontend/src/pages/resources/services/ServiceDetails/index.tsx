import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { IServiceDocument, Tier } from "../../../../../../shared/interfaces";
import { TextInput, UrlInput } from "../../../../components/Input";
import Select from "../../../../components/Select";
import TextArea from "../../../../components/TextArea";
import UpdatableDetailsForm from "../../../../components/UpdatableDetailsForm";
import { FormElement } from "../../../../interfaces";
import { SERVICES_BASE_API_URL } from "../../../../routes";
import { getTierOptions } from "../../../../utils";

type ServiceFormData = Partial<IServiceDocument>;

const fields = [
  {
    Component: TextInput,
    label: "Name:",
    id: "name",
    required: true,
  },
  {
    Component: TextArea,
    label: "Description:",
    id: "description",
    required: true,
  },
  {
    Component: UrlInput,
    label: "URL:",
    id: "url",
    required: true,
  },
  {
    Component: TextInput,
    label: "Version:",
    id: "version",
    required: true,
    fieldProps: {
      placeholder: "1.0.0",
      pattern: /^\d\.\d\.\d$/,
    },
  },
  {
    Component: Select,
    label: "Tier:",
    id: "tier",
    required: true,
    fieldProps: {
      options: getTierOptions(),
    },
  },
];

const ServiceDetails = () => {
  const params = useParams();
  const serviceId = params.serviceId;

  const formShape: ServiceFormData = {
    name: "",
    description: "",
    url: "",
    version: "",
    tier: "" as Tier,
  };

  const handleChange = useCallback(
    (target: FormElement, updatedFormData: ServiceFormData) => {
      const newFormData = { ...updatedFormData };

      newFormData[target.name as keyof IServiceDocument] =
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
      resourceUrl={SERVICES_BASE_API_URL}
      resourceId={serviceId as string}
      resourceName={"service"}
      onChange={handleChange}
      formShape={formShape}
      fields={fields}
    />
  );
};

export default ServiceDetails;
