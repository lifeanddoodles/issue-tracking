import { act, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import { ICompanyDocument, IUserDocument } from "shared/interfaces";
import { vi } from "vitest";
import CompanyDetails from ".";
import { fakeClientUserNoCompany, fakeCompanies } from "../../../../__mocks__";
import {
  getUseResourceInfoMockReturnValue,
  requestUpdateResourceMock,
  useResourceInfoMockReturnWithError,
  useResourceInfoMockReturnWithSuccess,
} from "../../../../__mocks__/useResourceInfo";
import useResourceInfo from "../../../../hooks/useResourceInfo";
import { FormElement, ResourceState } from "../../../../interfaces";
import { COMPANIES_BASE_API_URL } from "../../../../routes";
import {
  IAuthContext,
  adminAuth,
  authBase,
  compareValue,
  componentWithAuthContext,
  fieldNotDisabled,
  getFieldByLabel,
  renderWithRouter,
  renderWithRouterFromRoute,
  testEach,
  updateFieldAndCheckValue,
} from "../../../../tests/utils";
import { getReadableInputName } from "../../../../utils";

vi.mock("../../../../hooks/useResourceInfo");

const fieldsToTest = [
  { fieldId: "name", newFieldValue: "New name" },
  { fieldId: "email", newFieldValue: "new@email.com" },
  { fieldId: "description", newFieldValue: "New description" },
  { fieldId: "subscriptionStatus", newFieldValue: "1" },
  { fieldId: "address.street", newFieldValue: "New street" },
  { fieldId: "address.city", newFieldValue: "New city" },
  { fieldId: "address.state", newFieldValue: "New state" },
  { fieldId: "address.zip", newFieldValue: "11111" },
  { fieldId: "address.country", newFieldValue: "New country" },
  { fieldId: "dba", newFieldValue: "New DBA" },
  { fieldId: "industry", newFieldValue: "1" },
  { fieldId: "newEmployee", newFieldValue: "1" },
  { fieldId: "assignedRepresentative", newFieldValue: "0" },
];

const fieldsToTestNoSelects = [
  { fieldId: "name", newFieldValue: "New name" },
  { fieldId: "email", newFieldValue: "new@email.com" },
  { fieldId: "description", newFieldValue: "New description" },
  { fieldId: "address.street", newFieldValue: "New street" },
  { fieldId: "address.city", newFieldValue: "New city" },
  { fieldId: "address.state", newFieldValue: "New state" },
  { fieldId: "address.zip", newFieldValue: "11111" },
  { fieldId: "address.country", newFieldValue: "New country" },
  { fieldId: "dba", newFieldValue: "New DBA" },
];

describe("CompanyDetails", () => {
  let auth: IAuthContext;
  let useResourceInfoMockReturn: ResourceState<unknown>;

  beforeAll(() => {
    vi.clearAllMocks();
  });

  describe("if company does not exist", async () => {
    beforeEach(async () => {
      useResourceInfoMockReturn = useResourceInfoMockReturnWithError;

      await getUseResourceInfoMockReturnValue(
        useResourceInfo,
        useResourceInfoMockReturn
      );

      auth = {
        user: {
          ...fakeClientUserNoCompany,
        } as IUserDocument,
        ...authBase,
      };
    });

    test("renders error", async () => {
      act(() => renderWithRouter(<CompanyDetails />, auth));

      const title = await screen.findByText(/error/i);
      const notApplicableTitle = screen.queryByText(/company details/i);

      expect(title).toBeInTheDocument();
      expect(notApplicableTitle).not.toBeInTheDocument();
    });
  });

  describe("if company exists", async () => {
    let company: ICompanyDocument;

    beforeEach(async () => {
      auth = {
        ...adminAuth,
      };

      company = fakeCompanies.find(
        (company) => company._id === auth.user.company
      ) as unknown as ICompanyDocument;

      useResourceInfoMockReturn = useResourceInfoMockReturnWithSuccess(company);

      await getUseResourceInfoMockReturnValue(
        useResourceInfo,
        useResourceInfoMockReturn
      );
    });

    test.each`
      fieldId                     | findBy
      ${"heading"}                | ${"role"}
      ${"name"}                   | ${"text"}
      ${"subscriptionStatus"}     | ${"text"}
      ${"email"}                  | ${"text"}
      ${"address.street"}         | ${"text"}
      ${"address.city"}           | ${"text"}
      ${"address.state"}          | ${"text"}
      ${"address.zip"}            | ${"text"}
      ${"address.country"}        | ${"text"}
      ${"dba"}                    | ${"text"}
      ${"industry"}               | ${"text"}
      ${"description"}            | ${"text"}
      ${"newEmployee"}            | ${"text"}
      ${"assignedRepresentative"} | ${"text"}
    `(
      "renders $fieldId with the correct value",
      async ({ fieldId, findBy }) => {
        act(() => renderWithRouter(<CompanyDetails />, auth));

        await waitFor(async () => {
          if (findBy === "role") {
            const title = await screen.findByRole(fieldId, {
              name: "Company Details",
            });
            expect(title).toBeInTheDocument();
          }

          if (findBy === "text") {
            const field = (await screen.findByLabelText(
              RegExp(`^${getReadableInputName(fieldId)}`, "i")
            )) as FormElement;

            expect(field).toBeInTheDocument();
            compareValue<ICompanyDocument>(field.value, company!, fieldId);
          }
        });
      }
    );

    /**
     * Test on change functionality
     */
    testEach(
      fieldsToTest,
      "when on edit mode, can change $fieldId field's value",
      async ({ fieldId, newFieldValue }) => {
        user.setup();

        act(() => renderWithRouter(<CompanyDetails />, auth));

        const [field, fieldLabel] = await getFieldByLabel(fieldId);

        const fieldEditButton = screen.queryByRole("button", {
          name: RegExp(`^edit ${fieldLabel}`, "i"),
        });

        expect(field).toHaveAttribute("disabled");
        expect(fieldEditButton).toBeInTheDocument();

        await user.click(fieldEditButton!);

        const fieldSaveButton = screen.queryByRole("button", {
          name: RegExp(`^save ${fieldLabel}`, "i"),
        });

        fieldNotDisabled(field);
        expect(
          screen.queryByRole("button", {
            name: RegExp(`^edit ${fieldLabel}`, "i"),
          })
        ).not.toBeInTheDocument();
        expect(fieldSaveButton).toBeInTheDocument();

        await act(() => updateFieldAndCheckValue(field, newFieldValue));
      }
    );

    /**
     * Test save changes functionality
     *
     * TODO: Fix failing tests for the select fields:
     * - subscriptionStatus
     * - industry
     * - newEmployee
     * - assignedRepresentative
     */
    testEach(
      fieldsToTestNoSelects,
      "when saving changes on $fieldId, the correct data is sent to the server",
      async ({ fieldId, newFieldValue }) => {
        user.setup();

        act(() =>
          renderWithRouterFromRoute(
            componentWithAuthContext(<CompanyDetails />, auth),
            [`/companies/${company?._id}`],
            "/companies/:companyId"
          )
        );

        const [field, fieldLabel] = await getFieldByLabel(fieldId);

        const fieldEditButton = screen.queryByRole("button", {
          name: RegExp(`^edit ${fieldLabel}`, "i"),
        });

        expect(field).toHaveAttribute("disabled");
        expect(fieldEditButton).toBeInTheDocument();

        await user.click(fieldEditButton!);

        const fieldSaveButton = screen.queryByRole("button", {
          name: RegExp(`^save ${fieldLabel}`, "i"),
        });

        expect(
          screen.queryByRole("button", {
            name: RegExp(`^edit ${fieldLabel}`, "i"),
          })
        ).not.toBeInTheDocument();
        expect(fieldSaveButton).toBeInTheDocument();

        await act(() => updateFieldAndCheckValue(field, newFieldValue));

        await user.click(fieldSaveButton!);

        const updatedField = fieldId.startsWith("address.")
          ? "address"
          : fieldId;
        const body = {
          [updatedField]: fieldId.startsWith("address.")
            ? {
                ...company!.address,
                [fieldId.split(".")[1]]: newFieldValue,
              }
            : newFieldValue,
        };

        await waitFor(async () => {
          expect(requestUpdateResourceMock).toHaveBeenCalled();
          expect(requestUpdateResourceMock).toHaveBeenCalledWith({
            url: `${COMPANIES_BASE_API_URL}/${company!._id}`,
            body,
          });
        });
      }
    );

    /**
     * Test cancel changes functionality
     *
     * TODO: Fix failing tests for the select fields:
     * - subscriptionStatus
     * - industry
     * - newEmployee
     * - assignedRepresentative
     */
    testEach(
      fieldsToTestNoSelects,
      "when on edit mode, can cancel changes on $fieldId field's value",
      async ({ fieldId, newFieldValue }) => {
        user.setup();

        act(() => renderWithRouter(<CompanyDetails />, auth));

        const [field, fieldLabel] = await getFieldByLabel(fieldId);

        const fieldEditButton = screen.queryByRole("button", {
          name: RegExp(`^edit ${fieldLabel}`, "i"),
        });
        const fieldCancelButton = await screen.findByRole("button", {
          name: RegExp(`^cancel changes to ${fieldLabel}`, "i"),
        });

        expect(fieldCancelButton).toBeInTheDocument();

        await user.click(fieldEditButton!);

        await act(() => updateFieldAndCheckValue(field, newFieldValue));

        await user.click(fieldCancelButton!);

        await waitFor(() => {
          compareValue<ICompanyDocument>(
            field.value,
            company!,
            fieldId as keyof ICompanyDocument
          );
        });
      }
    );
  });
});
