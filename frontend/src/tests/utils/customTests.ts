type TestCaseProps = { fieldId: string; newFieldValue: string };

export function testEach(
  testCases: TestCaseProps[],
  testName: string,
  fn: (args: TestCaseProps) => Promise<void>
) {
  return test.each(
    testCases.map(({ fieldId, newFieldValue }) => [{ fieldId, newFieldValue }])
  )(
    testName,
    async ({ fieldId, newFieldValue }) => await fn({ fieldId, newFieldValue })
  );
}
