import { useCallback, useEffect, useMemo } from "react";
import useForm from "../../hooks/useForm";
import useValidation from "../../hooks/useValidation";
import { FormElement } from "../../interfaces";
import {
  objValuesAreFalsy,
  toCapital,
  traverseAndUpdateObject,
} from "../../utils";
import Heading from "../Heading";

const withUpdatableResourceForm = <
  T extends Record<string, unknown>,
  U extends Record<string, unknown>
>(
  Component: JSX.ElementType
) => {
  return ({
    resourceUrl,
    resourceId,
    resourceName,
    onChange,
    formShape,
    children,
  }: {
    resourceUrl: string;
    resourceId: string;
    resourceName: string;
    onChange: (target: FormElement, updates: Partial<T>) => Partial<T>;
    formShape: Partial<T>;
    children: JSX.Element | JSX.Element[];
  }) => {
    const {
      setObjectShape,
      formData,
      setFormData,
      errors,
      setErrors,
      initialFormData,
      setInitialFormData,
      changedFormData,
      data,
      loading,
      error,
      requestGetResource,
      requestUpdateResource,
      requestDeleteResource,
    } = useForm<T, U>({});

    const objShape = useMemo(
      () => traverseAndUpdateObject<T, U>(formShape, data),
      [data, formShape]
    );

    const formDataShape = useMemo<Partial<T> | null>(
      () => (objValuesAreFalsy(objShape) ? null : objShape),
      [objShape]
    );

    const { validateField } = useValidation();

    const getResourceInfo = useCallback(async () => {
      await requestGetResource({
        url: `${resourceUrl}/${resourceId}`,
      });
    }, [requestGetResource, resourceId, resourceUrl]);

    const handleChange = useCallback(
      (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        const target = e.target;

        setFormData((prevFormData) => {
          // Clone the previous data to avoid mutations
          const currentFormData: Partial<T> = { ...prevFormData } as Partial<T>;
          return onChange(target, currentFormData);
        });

        validateField({
          target,
          setErrors,
        });
      },
      [onChange, setErrors, setFormData, validateField]
    );

    const handleSave = useCallback(async () => {
      await requestUpdateResource({
        url: `${resourceUrl}/${resourceId}`,
        body: changedFormData as Partial<U>,
      });
      getResourceInfo();
      setInitialFormData(formData);
      /*
       * TODO: Reset fields after submit
       * If field name is not in resource's schema, it will be reset
       */
    }, [
      changedFormData,
      formData,
      getResourceInfo,
      requestUpdateResource,
      resourceId,
      resourceUrl,
      setInitialFormData,
    ]);

    const handleCancel = useCallback(() => {
      setFormData(initialFormData);
    }, [initialFormData, setFormData]);

    const handleDelete = useCallback(async () => {
      await requestDeleteResource({
        url: `${resourceUrl}/${resourceId}`,
      });
    }, [requestDeleteResource, resourceId, resourceUrl]);

    useEffect(() => {
      formDataShape && formDataShape !== null && setObjectShape(formDataShape);
    }, [formShape, objShape, formDataShape, setObjectShape]);

    useEffect(() => {
      const fetchData = async () => {
        await getResourceInfo();
      };

      fetchData();
    }, [getResourceInfo]);

    const resourceProps = useMemo(
      () => ({
        formData,
        loading,
        error,
        errors,
        setErrors,
        onChange: handleChange,
        onSave: handleSave,
        onCancel: handleCancel,
        onDelete: handleDelete,
        children,
      }),
      [
        children,
        error,
        errors,
        handleCancel,
        handleChange,
        handleDelete,
        handleSave,
        loading,
        setErrors,
        formData,
      ]
    );

    return (
      <>
        {loading && (
          <Heading
            text={`Loading ${resourceName} details...`}
            level={1}
            role="status"
          />
        )}
        {!formData && (
          <Heading
            text={`${toCapital(resourceName)} not found`}
            level={1}
            role="status"
          />
        )}
        {error && <Heading text={error.message} role="status" />}
        {formData && (
          <Component resourceName={resourceName} {...resourceProps} />
        )}
      </>
    );
  };
};

export default withUpdatableResourceForm;
