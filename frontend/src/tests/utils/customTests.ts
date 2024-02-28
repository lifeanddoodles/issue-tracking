type TestCaseProps = {
  fieldId: string;
  newFieldValue: string;
  findBy?: string;
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
        testCases.map(({ fieldId, newFieldValue, findBy }) => [
          { fieldId, newFieldValue, findBy },
        ])
      )(
        testName,
        async ({ fieldId, newFieldValue, findBy }) =>
          await fn({ fieldId, newFieldValue, findBy })
      );
    case "only":
      return test.only.each(
        testCases.map(({ fieldId, newFieldValue, findBy }) => [
          { fieldId, newFieldValue, findBy },
        ])
      )(
        testName,
        async ({ fieldId, newFieldValue, findBy }) =>
          await fn({ fieldId, newFieldValue, findBy })
      );
    default:
      return test.each(
        testCases.map(({ fieldId, newFieldValue, findBy }) => [
          { fieldId, newFieldValue, findBy },
        ])
      )(
        testName,
        async ({ fieldId, newFieldValue, findBy }) =>
          await fn({ fieldId, newFieldValue, findBy })
      );
  }
}
