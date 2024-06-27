import { useCallback, useEffect, useMemo, useState } from "react";
import { baseUrl } from "../__mocks__";
import { FetchState, RequestProps } from "../interfaces";

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

        // Check if the response is JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const json = await response.json();
          if (!response.ok || (json.success && !json.success)) {
            throw new Error(
              `${json.message}` ||
                `${response.statusText}. Status: ${response.status}`
            );
          }
          setData(json);
        } else {
          if (contentType?.includes("text/html")) return;
          throw new Error(`Unexpected content type: ${contentType}`);
        }

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
