import { useCallback, useEffect, useState } from "react";
import useFetch from "./useFetch";

const useForm = <T, U>({
  formShape,
  url,
  onSuccess,
}: {
  formShape: Partial<T>;
  url: string;
  onSuccess?: () => void;
}) => {
  const [formData, setFormData] = useState(formShape);
  const [errors, setErrors] = useState<{ [key: string]: string[] } | null>(
    null
  );
  const { data, error, loading, sendRequest } = useFetch<U>();

  const submitRequest = useCallback(
    (options?: RequestInit) => {
      sendRequest({
        url,
        options,
      });
    },
    [url, sendRequest]
  );

  const handleSubmit = (options?: RequestInit) => {
    submitRequest(options);
  };

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
  };
};

export default useForm;
