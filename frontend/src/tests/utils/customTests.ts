import { ChainableOptions, TestCaseProps } from "../../interfaces";

export function testEach(
  testCases: TestCaseProps[],
  testName: string,
  fn: (args: TestCaseProps) => Promise<void>,
  chainableFn?: ChainableOptions
) {
  switch (chainableFn) {
    case "skip":
      return test.skip.each(
        testCases.map(
          ({
            fieldId,
            newFieldValue,
            findBy,
            customLabel,
            allowedTiers,
            permissions,
          }) => [
            {
              fieldId,
              newFieldValue,
              findBy,
              customLabel,
              allowedTiers,
              permissions,
            },
          ]
        )
      )(
        testName,
        async ({
          fieldId,
          newFieldValue,
          findBy,
          customLabel,
          allowedTiers,
          permissions,
        }) =>
          await fn({
            fieldId,
            newFieldValue,
            findBy,
            customLabel,
            allowedTiers,
            permissions,
          })
      );
    case "only":
      return test.only.each(
        testCases.map(
          ({
            fieldId,
            newFieldValue,
            findBy,
            customLabel,
            allowedTiers,
            permissions,
          }) => [
            {
              fieldId,
              newFieldValue,
              findBy,
              customLabel,
              allowedTiers,
              permissions,
            },
          ]
        )
      )(
        testName,
        async ({
          fieldId,
          newFieldValue,
          findBy,
          customLabel,
          allowedTiers,
          permissions,
        }) =>
          await fn({
            fieldId,
            newFieldValue,
            findBy,
            customLabel,
            allowedTiers,
            permissions,
          })
      );
    default:
      return test.each(
        testCases.map(
          ({
            fieldId,
            newFieldValue,
            findBy,
            customLabel,
            allowedTiers,
            permissions,
          }) => [
            {
              fieldId,
              newFieldValue,
              findBy,
              customLabel,
              allowedTiers,
              permissions,
            },
          ]
        )
      )(
        testName,
        async ({
          fieldId,
          newFieldValue,
          findBy,
          customLabel,
          allowedTiers,
          permissions,
        }) =>
          await fn({
            fieldId,
            newFieldValue,
            findBy,
            customLabel,
            allowedTiers,
            permissions,
          })
      );
  }
}
