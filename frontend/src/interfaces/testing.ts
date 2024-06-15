import { Tier, UserRole } from "../../../shared/interfaces";

export type TestCaseProps = {
  fieldId: string;
  newFieldValue: string | number;
  findBy?: string;
  customLabel?: string | null;
  allowedTiers?: Tier[];
  permissions?: {
    view?: UserRole[];
    edit?: UserRole[];
  };
};

export type ChainableOptions = "only" | "skip";
