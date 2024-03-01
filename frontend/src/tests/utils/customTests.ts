type TestCaseProps = {
  fieldId: string;
  newFieldValue: string;
  findBy?: string;
  customLabel?: string | null;
};

type ChainableOptions = "only" | "skip";

export function testEach(
  testCases: TestCaseProps[],
  testName: string,
  fn: (args: TestCaseProps) => Promise<void>,
  chainableFn?: ChainableOptions
) {
  switch (chainableFn) {
    case "skip":
      return test.skip.each(
        testCases.map(({ fieldId, newFieldValue, findBy, customLabel }) => [
          { fieldId, newFieldValue, findBy, customLabel },
        ])
      )(
        testName,
        async ({ fieldId, newFieldValue, findBy, customLabel }) =>
          await fn({ fieldId, newFieldValue, findBy, customLabel })
      );
    case "only":
      return test.only.each(
        testCases.map(({ fieldId, newFieldValue, findBy, customLabel }) => [
          { fieldId, newFieldValue, findBy, customLabel },
        ])
      )(
        testName,
        async ({ fieldId, newFieldValue, findBy, customLabel }) =>
          await fn({ fieldId, newFieldValue, findBy, customLabel })
      );
    default:
      return test.each(
        testCases.map(({ fieldId, newFieldValue, findBy, customLabel }) => [
          { fieldId, newFieldValue, findBy, customLabel },
        ])
      )(
        testName,
        async ({ fieldId, newFieldValue, findBy, customLabel }) =>
          await fn({ fieldId, newFieldValue, findBy, customLabel })
      );
  }
}
