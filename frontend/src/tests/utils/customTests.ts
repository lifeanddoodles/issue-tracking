type TestCaseProps = {
  fieldId: string;
  newFieldValue: string;
  findBy?: string;
};

export function testEach(
  testCases: TestCaseProps[],
  testName: string,
  fn: (args: TestCaseProps) => Promise<void>
) {
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
