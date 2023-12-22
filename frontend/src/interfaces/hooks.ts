export interface RequestProps {
  url: string;
  options?: RequestInit;
}

export interface ResourceRequestProps<T> extends RequestProps {
  body?: Partial<T>;
  callback?: () => void;
}

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  sendRequest: (props: RequestProps | null) => Promise<void>;
}

export interface ResourceState<T> extends Omit<FetchState<T>, "sendRequest"> {
  requestGetResource: ({ url }: ResourceRequestProps<T>) => Promise<void>;
  requestUpdateResource: ({
    url,
    body,
  }: ResourceRequestProps<T>) => Promise<void>;
  requestDeleteResource: ({ url }: ResourceRequestProps<T>) => Promise<void>;
}
