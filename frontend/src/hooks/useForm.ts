import { useCallback, useEffect, useState } from "react";
import { isEmpty, isFalsy } from "../utils";
import useResourceInfo from "./useResourceInfo";

export const hasUpdates = <T>(
  formData: Partial<T>,
  initialFormData: Partial<T>
) => {
  if (!formData || !initialFormData) return {};
  const changes: Partial<T> = {};

  for (const key in formData) {
    if (
      typeof formData[key as keyof T] === "object" &&
      JSON.stringify(formData[key as keyof T]) !==
        JSON.stringify(initialFormData![key as keyof T])
    ) {
      if (!Array.isArray(formData[key as keyof T])) {
        for (const subKey in formData[key as keyof T]) {
          if (
            formData[key as keyof T] &&
            formData[key as keyof T][subKey] !==
              initialFormData![key as keyof T][subKey]
          ) {
            if (!changes[key as keyof T]) {
              // Initialize changes[key] if it's undefined
              changes[key as keyof T] = {} as unknown as T[keyof T];
            }
            changes[key as keyof T][subKey] = formData[key as keyof T][subKey];
          }
        }
      }
      if (Array.isArray(formData[key as keyof T])) {
        changes[key as keyof T] = formData[key as keyof T];
      }
    }
    if (
      typeof formData[key as keyof T] !== "object" &&
      typeof formData[key as keyof T] !== "undefined" &&
      (!initialFormData[key as keyof T] ||
        initialFormData[key as keyof T] === undefined ||
        initialFormData[key as keyof T] === null ||
        formData[key as keyof T] !== initialFormData[key as keyof T])
    ) {
      changes[key as keyof T] = formData[key as keyof T];
    }
  }
  return changes;
};

interface IUseFormProps<T> {
  formShape?: T;
  url?: string;
  onSuccess?: () => void;
}

const useForm = <T, U>({ formShape, url, onSuccess }: IUseFormProps<T>) => {
  const [objectShape, setObjectShape] = useState<Partial<T> | null>(null);
  const [formData, setFormData] = useState<Partial<T> | null>(null);
  const [initialFormData, setInitialFormData] = useState<Partial<T> | null>(
    null
  );
  const [changedFormData, setChangedFormData] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(
    null
  );
  const {
    data,
    loading,
    error,
    requestGetResource,
    requestUpdateResource,
    requestDeleteResource,
  } = useResourceInfo<U | null>();

  const submitRequest = useCallback(
    (body?: Partial<U | null>) => {
      if (!url) return;
      requestUpdateResource({
        url,
        body,
      });
    },
    [url, requestUpdateResource]
  );

  const handleSubmit = useCallback(
    (body?: Partial<U | null>) => {
      submitRequest(body);
    },
    [submitRequest]
  );

  useEffect(() => {
    if (
      (!isFalsy(formShape) || objectShape !== null) &&
      (formData === null || formData === undefined)
    ) {
      setFormData({ ...(formShape || objectShape) });
      setInitialFormData({ ...(formShape || objectShape) });
    }
  }, [formData, formShape, objectShape]);

  useEffect(() => {
    if (formData !== null && initialFormData !== null) {
      const updates = hasUpdates(formData, initialFormData);

      if (!isEmpty(updates)) {
        setChangedFormData(updates);
      }
    }
  }, [setChangedFormData, formData, initialFormData]);

  useEffect(() => {
    if (onSuccess && data && !loading && !error) {
      onSuccess();
    }
  }, [data, error, loading, onSuccess]);

  return {
    setObjectShape,
    formData,
    setFormData,
    errors,
    setErrors,
    onSubmit: handleSubmit,
    initialFormData,
    setInitialFormData,
    changedFormData,
    setChangedFormData,
    data,
    loading,
    error,
    requestGetResource,
    requestUpdateResource,
    requestDeleteResource,
  };
};

export default useForm;
