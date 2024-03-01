import { useCallback, useMemo } from "react";
import useFetch from "../hooks/useFetch";
import { ResourceRequestProps, ResourceState } from "../interfaces";
import { getDeleteOptions, getPostOptions, getUpdateOptions } from "../routes";

const useResourceInfo = <T>(): ResourceState<T> => {
  const { data, loading, error, sendRequest } = useFetch<T | null>();

  const requestGetResource = useCallback(
    async ({ url }: ResourceRequestProps<T>) => {
      await sendRequest({ url });
    },
    [sendRequest]
  );

  const requestPostResource = useCallback(
    async ({ url, body }: ResourceRequestProps<T>) => {
      const options = getPostOptions(body!);
      await sendRequest({ url, options });
    },
    [sendRequest]
  );

  const requestUpdateResource = useCallback(
    async ({ url, body }: ResourceRequestProps<T>) => {
      const options = getUpdateOptions(body!);
      await sendRequest({ url, options });
    },
    [sendRequest]
  );

  const requestDeleteResource = useCallback(
    async ({ url }: ResourceRequestProps<T>) => {
      const options = getDeleteOptions();
      await sendRequest({ url, options });
    },
    [sendRequest]
  );

  return {
    data: useMemo(() => data, [data]),
    loading,
    error,
    requestGetResource,
    requestPostResource,
    requestUpdateResource,
    requestDeleteResource,
  };
};

export default useResourceInfo;
