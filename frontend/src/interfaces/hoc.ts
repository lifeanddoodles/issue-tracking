import { FormElement } from ".";

export interface ResourceUpdatableFormProps<T> {
  resourceUrl: string;
  resourceId: string;
  resourceName: string;
  onChange: (target: FormElement, updates: Partial<T>) => Partial<T>;
  formShape: Partial<T>;
  children?: JSX.Element | JSX.Element[];
}
