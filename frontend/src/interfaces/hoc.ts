import { PropsWithChildren } from "react";
import { FormElement } from ".";
import { UserRole } from "../../../shared/interfaces";

export interface ResourceUpdatableFormProps<T> {
  resourceUrl: string;
  resourceId: string;
  resourceName: string;
  onChange: (target: FormElement, updates: Partial<T>) => Partial<T>;
  formShape: Partial<T>;
  userRole?: UserRole;
  children?: JSX.Element | JSX.Element[];
  title?: string;
}

export type SecondaryLabel = "view" | "create" | "edit" | "delete";

export type WrapperWithLinkFallbackProps = PropsWithChildren<{
  resourceId?: string;
  resourceName: string;
  uiResourceBaseUrl?: string;
  secondaryLabels?: Partial<{
    [key in SecondaryLabel]: string;
  }>;
  forceVisible?: boolean;
}>;
