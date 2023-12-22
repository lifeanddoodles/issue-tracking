import { useCallback, useEffect, useState } from "react";
import { isEmpty, isFalsy } from "../utils";
import useFetch from "./useFetch";

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

const useForm = <T, U>({
  formShape,
  url,
  onSuccess,
}: {
  formShape: Partial<T>;
  url?: string;
  onSuccess?: () => void;
}) => {
  const [formData, setFormData] = useState<Partial<T> | null>(
    !isEmpty(formShape) ? formShape : null
  );
  const [initialFormData, setInitialFormData] = useState<Partial<T> | null>(
    !isEmpty(formShape) ? formShape : null
  );
  const [changedFormData, setChangedFormData] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(
    null
  );
  const { data, error, loading, sendRequest } = useFetch<U>();

  const submitRequest = useCallback(
    (options?: RequestInit) => {
      if (!url) return;
      sendRequest({
        url,
        options,
      });
    },
    [url, sendRequest]
  );

  const handleSubmit = useCallback(
    (options?: RequestInit) => {
      submitRequest(options);
    },
    [submitRequest]
  );

  useEffect(() => {
    if (isFalsy(formData) && !isFalsy(formShape)) setFormData(formShape);
  }, [formData, formShape]);

  useEffect(() => {
    if (!isFalsy(formData) && (!initialFormData || initialFormData === null)) {
      setInitialFormData(formData);
    }
  }, [initialFormData, setInitialFormData, formData]);

  useEffect(() => {
    if (!isFalsy(formData) && !isFalsy(initialFormData)) {
      const updates = hasUpdates(formData!, initialFormData!);

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
    formData,
    setFormData,
    errors,
    setErrors,
    onSubmit: handleSubmit,
    data,
    initialFormData,
    setInitialFormData,
    changedFormData,
    setChangedFormData,
  };
};

export default useForm;
