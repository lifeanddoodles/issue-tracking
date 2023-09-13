import { useCallback, useEffect, useState } from "react";

interface RequestProps {
  url: string;
  options?: RequestInit;
}

interface FetchState<T> {
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

        const url = props?.url || reqProps?.url;
        const options = props?.options || reqProps?.options;
        if (!url) return;

        console.log(url, options);

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

  return { data, loading, error, sendRequest };
};

export default useFetch;
