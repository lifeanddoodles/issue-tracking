export type TestCaseProps = {
  fieldId: string;
  newFieldValue: string | number;
  findBy?: string;
  customLabel?: string | null;
};

export type ChainableOptions = "only" | "skip";
