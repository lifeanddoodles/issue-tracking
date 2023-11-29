import { ObjectId } from "mongoose";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IServiceDocument } from "../../../../../../shared/interfaces";
import Button from "../../../../components/Button";
import FormControlWithActions from "../../../../components/FormControlWithActions";
import Heading from "../../../../components/Heading";
import { TextInput } from "../../../../components/Input";
import Select from "../../../../components/Select";
import TextArea from "../../../../components/TextArea";
import useFetch from "../../../../hooks/useFetch";
import useValidation from "../../../../hooks/useValidation";
import {
  SERVICES_BASE_API_URL,
  getDeleteOptions,
  getUpdateOptions,
} from "../../../../routes";
import { getTierOptions } from "../../../../utils";

type PartialDocument = Partial<IServiceDocument>;

const ServiceDetails = () => {
  const params = useParams();
  const serviceId = params.serviceId;
  const {
    data: service,
    loading,
    error,
    sendRequest,
  } = useFetch<IServiceDocument | null>();

  const [initialFormData, setInitialFormData] =
    useState<PartialDocument | null>(null);
  const [formData, setFormData] = useState<PartialDocument | null>(null);
  const [changedFormData, setChangedFormData] = useState<PartialDocument>({});
  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(
    null
  );
  const { validateField } = useValidation();

  const getServiceInfo = useCallback(() => {
    sendRequest({ url: `${SERVICES_BASE_API_URL}/${serviceId}` });
  }, [serviceId, sendRequest]);

  const requestDelete = () => {
    sendRequest({
      url: `${SERVICES_BASE_API_URL}/${serviceId}`,
      options: getDeleteOptions(),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;

    setFormData({
      ...formData!,
      [target.name]:
        target.type === "checkbox"
          ? (target as HTMLInputElement).checked
          : target.value !== "" && target.value
          ? target.value
          : null,
    });

    validateField({
      target,
      setErrors,
    });
  };

  const handleCancel = (
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
      ...formData,
      [target.id]: initialValue,
    });
  };

  const handleSave = async () => {
    const options = getUpdateOptions(changedFormData);
    await sendRequest({
      url: `${SERVICES_BASE_API_URL}/${serviceId}`,
      options,
    });
    getServiceInfo();
  };

  const handleDelete = () => {
    requestDelete();
  };

  useEffect(() => getServiceInfo(), [getServiceInfo]);

  useEffect(() => {
    if (service && !loading) {
      const formDataShape: PartialDocument = {
        name: service.name,
        description: service.description,
        url: service.url,
        version: service.version,
        tier: service.tier,
      };
      setInitialFormData(formDataShape);
      setFormData(formDataShape);
    }
  }, [loading, service]);

  useEffect(() => {
    const changes: PartialDocument = {};

    for (const key in formData) {
      if (
        initialFormData &&
        formData[key as keyof IServiceDocument] !==
          initialFormData[key as keyof IServiceDocument]
      ) {
        changes[key as keyof IServiceDocument] =
          formData[key as keyof IServiceDocument];
      }
    }
    setChangedFormData(changes);
  }, [formData, initialFormData]);

  if (loading) {
    return <Heading text="Loading..." level={1} role="status" />;
  }

  if (error) {
    return <Heading text={error.message} level={1} role="status" />;
  }

  if (!service) {
    return <Heading text="Service not found" level={1} role="status" />;
  }

  return (
    service &&
    !loading &&
    formData && (
      <div className="service-details flex flex-col align-stretch">
        <div className="service-details__actions self-end flex gap-4">
          <Button onClick={handleDelete}>Delete</Button>
        </div>
        <Heading text="Service details" level={1} />
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
          label="Description:"
          id="description"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData?.description}
          required
          errors={errors}
          setErrors={setErrors}
          component={TextArea}
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
          component={TextInput}
        />
        <FormControlWithActions
          label="Version:"
          id="version"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData?.version}
          required
          errors={errors}
          setErrors={setErrors}
          component={TextInput}
        />
        <FormControlWithActions
          label="Tier:"
          id="tier"
          onChange={handleChange}
          onCancel={handleCancel}
          onSave={handleSave}
          value={formData?.tier}
          options={getTierOptions()}
          required
          errors={errors}
          setErrors={setErrors}
          component={Select}
        />
      </div>
    )
  );
};

export default ServiceDetails;
