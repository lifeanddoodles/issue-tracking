import { useCallback, useEffect, useMemo, useState } from "react";
import { baseUrl } from "../__mocks__";

export interface RequestProps {
  url: string;
  options?: RequestInit;
}

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  sendRequest: (props: RequestProps | null) => Promise<void>;
}

const useFetch = <T>(reqProps?: RequestProps | null): FetchState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const sendRequest = useCallback(
    async (props?: RequestProps | null) => {
      try {
        setLoading(true);

        const reqUrl = props?.url || reqProps?.url;
        const isRelativeUrl = reqUrl?.startsWith("/");
        const url = `${isRelativeUrl ? baseUrl : ""}${reqUrl}`;
        const options = props?.options || reqProps?.options;
        if (!url) return;

        const response = await fetch(url, options);

        if (!response.ok) {
          setError(new Error(`HTTP error! Status: ${response.status}`));
        }

        const json = await response.json();
        setData(json);
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    },
    [reqProps?.options, reqProps?.url]
  );

  useEffect(() => {
    if (reqProps?.url) sendRequest();
  }, [sendRequest, reqProps?.url]);

  return {
    data: useMemo(() => data, [data]),
    loading: useMemo(() => loading, [loading]),
    error: useMemo(() => error, [error]),
    sendRequest,
  };
};

export default useFetch;
