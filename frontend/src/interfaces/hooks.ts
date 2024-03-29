import { Dispatch, SetStateAction } from "react";

export interface RequestProps {
  url: string;
  options?: RequestInit;
}

export interface ResourceRequestProps<T> extends Omit<RequestProps, "options"> {
  body?: Partial<T>;
}

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  sendRequest: (props: RequestProps | null) => Promise<void>;
}

export interface ResourceState<T> extends Omit<FetchState<T>, "sendRequest"> {
  requestGetResource: ({ url }: ResourceRequestProps<T>) => Promise<void>;
  requestPostResource: ({
    url,
    body,
  }: ResourceRequestProps<T>) => Promise<void>;
  requestUpdateResource: ({
    url,
    body,
  }: ResourceRequestProps<T>) => Promise<void>;
  requestDeleteResource: ({ url }: ResourceRequestProps<T>) => Promise<void>;
}

export interface FormReturnState<T>
  extends Omit<FetchState<T>, "sendRequest">,
    ResourceState<T> {
  setObjectShape?: Dispatch<SetStateAction<Partial<T>>>;
  formData?: Partial<T>;
  setFormData?: Dispatch<SetStateAction<Partial<T>>>;
  errors?: { [key: string]: string[] } | null;
  setErrors?: Dispatch<SetStateAction<{ [key: string]: string[] } | null>>;
  onSubmit?: () => Promise<void>;
  initialFormData?: Partial<T>;
  setInitialFormData?: Dispatch<SetStateAction<Partial<T>>>;
  changedFormData?: Partial<T>;
  setChangedFormData?: Dispatch<SetStateAction<Partial<T>>>;
}
