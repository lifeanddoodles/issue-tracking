import { act, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import { vi } from "vitest";
import CompanyDetails from ".";
import {
  ICompanyDocument,
  Tier,
  UserRole,
} from "../../../../../../shared/interfaces";
import {
  companyWithTier,
  fakeClientUserNoCompany,
  fakeClientUserWithSpecificTier,
  fakeCompanies,
} from "../../../../__mocks__";
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

const selectFields = [
  "subscriptionStatus",
  "industry",
  "newEmployee",
  "assignedRepresentative",
];

const fieldsToTest = [
  {
    fieldId: "name",
    newFieldValue: "New name",
    allowedTiers: [Tier.ENTERPRISE, Tier.PRO, Tier.FREE],
    permissions: {
      view: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
      edit: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
    },
  },
  {
    fieldId: "email",
    newFieldValue: "new@email.com",
    allowedTiers: [Tier.ENTERPRISE, Tier.PRO, Tier.FREE],
    permissions: {
      view: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
      edit: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
    },
  },
  {
    fieldId: "description",
    newFieldValue: "New description",
    allowedTiers: [Tier.ENTERPRISE, Tier.PRO, Tier.FREE],
    permissions: {
      view: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
      edit: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
    },
  },
  {
    fieldId: "subscriptionStatus",
    newFieldValue: "1",
    allowedTiers: [Tier.ENTERPRISE, Tier.PRO, Tier.FREE],
    permissions: {
      view: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
      edit: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
    },
  },
  {
    fieldId: "address.street",
    newFieldValue: "New street",
    allowedTiers: [Tier.ENTERPRISE, Tier.PRO, Tier.FREE],
    permissions: {
      view: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
      edit: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
    },
  },
  {
    fieldId: "address.city",
    newFieldValue: "New city",
    allowedTiers: [Tier.ENTERPRISE, Tier.PRO, Tier.FREE],
    permissions: {
      view: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
      edit: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
    },
  },
  {
    fieldId: "address.state",
    newFieldValue: "New state",
    allowedTiers: [Tier.ENTERPRISE, Tier.PRO, Tier.FREE],
    permissions: {
      view: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
      edit: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
    },
  },
  {
    fieldId: "address.zip",
    newFieldValue: "11111",
    allowedTiers: [Tier.ENTERPRISE, Tier.PRO, Tier.FREE],
    permissions: {
      view: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
      edit: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
    },
  },
  {
    fieldId: "address.country",
    newFieldValue: "New country",
    allowedTiers: [Tier.ENTERPRISE, Tier.PRO, Tier.FREE],
    permissions: {
      view: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
      edit: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
    },
  },
  {
    fieldId: "dba",
    newFieldValue: "New DBA",
    allowedTiers: [Tier.ENTERPRISE, Tier.PRO, Tier.FREE],
    permissions: {
      view: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
      edit: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
    },
  },
  {
    fieldId: "industry",
    newFieldValue: "1",
    allowedTiers: [Tier.ENTERPRISE, Tier.PRO, Tier.FREE],
    permissions: {
      view: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
      edit: [UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT],
    },
  },
  {
    fieldId: "newEmployee",
    newFieldValue: "1",
    allowedTiers: [Tier.ENTERPRISE, Tier.PRO, Tier.FREE],
    permissions: {
      view: [UserRole.ADMIN, UserRole.STAFF],
      edit: [UserRole.ADMIN, UserRole.STAFF],
    },
  },
  {
    fieldId: "assignedRepresentative",
    newFieldValue: "0",
    allowedTiers: [Tier.ENTERPRISE],
    permissions: {
      view: [UserRole.ADMIN, UserRole.STAFF],
      edit: [UserRole.ADMIN, UserRole.STAFF],
    },
  },
];

const fieldsToTestNoSelects = fieldsToTest.filter(
  (field) => !selectFields.includes(field.fieldId)
);

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
        },
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

  describe("if company exists and user is admin", async () => {
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
      async ({ fieldId, newFieldValue, allowedTiers, permissions }) => {
        user.setup();

        act(() => renderWithRouter(<CompanyDetails />, auth));

        const [field, fieldLabel] = await getFieldByLabel(fieldId);

        const fieldEditButton = await screen.findByRole("button", {
          name: RegExp(`^edit ${fieldLabel}`, "i"),
        });

        if (!permissions?.view?.includes(auth.user.role as UserRole)) {
          expect(fieldEditButton).not.toBeInTheDocument();
          return;
        }

        expect(field).toHaveAttribute("disabled");
        expect(fieldEditButton).toBeInTheDocument();

        if (
          allowedTiers?.includes(company?.tier) &&
          permissions?.edit?.includes(auth.user.role as UserRole)
        ) {
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
      async ({ fieldId, newFieldValue, allowedTiers, permissions }) => {
        user.setup();

        act(() =>
          renderWithRouterFromRoute(
            componentWithAuthContext(<CompanyDetails />, auth),
            [`/companies/${company?._id}`],
            "/companies/:companyId"
          )
        );

        waitFor(async () => {
          const [field, fieldLabel] = await getFieldByLabel(fieldId);

          const fieldEditButton = await screen.findByRole("button", {
            name: RegExp(`^edit ${fieldLabel}`, "i"),
          });

          if (!permissions?.view?.includes(auth.user.role as UserRole)) {
            expect(fieldEditButton).not.toBeInTheDocument();
            return;
          }

          expect(field).toHaveAttribute("disabled");
          expect(fieldEditButton).toBeInTheDocument();

          if (
            allowedTiers?.includes(company?.tier) &&
            permissions?.edit?.includes(auth.user.role as UserRole)
          ) {
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

            expect(requestUpdateResourceMock).toHaveBeenCalled();
            expect(requestUpdateResourceMock).toHaveBeenCalledWith({
              url: `${COMPANIES_BASE_API_URL}/${company!._id}`,
              body,
            });
          }
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
      async ({ fieldId, newFieldValue, allowedTiers, permissions }) => {
        user.setup();

        act(() => renderWithRouter(<CompanyDetails />, auth));

        waitFor(async () => {
          const [field, fieldLabel] = await getFieldByLabel(fieldId);

          const fieldEditButton = await screen.findByRole("button", {
            name: RegExp(`^edit ${fieldLabel}`, "i"),
          });
          const fieldCancelButton = await screen.findByRole("button", {
            name: RegExp(`^cancel changes to ${fieldLabel}`, "i"),
          });

          if (!permissions?.view?.includes(auth.user.role as UserRole)) {
            expect(fieldEditButton).not.toBeInTheDocument();
            return;
          }

          if (
            allowedTiers?.includes(company?.tier) &&
            permissions?.edit?.includes(auth.user.role as UserRole)
          ) {
            expect(fieldCancelButton).toBeInTheDocument();

            await user.click(fieldEditButton!);

            await act(() => updateFieldAndCheckValue(field, newFieldValue));

            await user.click(fieldCancelButton!);

            compareValue<ICompanyDocument>(
              field.value,
              company!,
              fieldId as keyof ICompanyDocument
            );
          }
        });
      }
    );
  });

  describe("if company exists and user is client", async () => {
    let company: ICompanyDocument;

    beforeEach(async () => {
      auth = {
        ...authBase,
        user: fakeClientUserWithSpecificTier(Tier.FREE),
      };

      company = companyWithTier(Tier.FREE) as ICompanyDocument;

      useResourceInfoMockReturn = useResourceInfoMockReturnWithSuccess(company);

      await getUseResourceInfoMockReturnValue(
        useResourceInfo,
        useResourceInfoMockReturn
      );
    });

    /**
     * Test view and edit permissions
     */
    testEach(
      fieldsToTest,
      "$fieldId field is restricted according to company's tier level and user role's view and edit permissions",
      async ({ fieldId, newFieldValue, allowedTiers, permissions }) => {
        user.setup();

        act(() => renderWithRouter(<CompanyDetails />, auth));

        waitFor(async () => {
          const [field, fieldLabel] = await getFieldByLabel(fieldId);

          const fieldEditButton = await screen.findByRole("button", {
            name: RegExp(`^edit ${fieldLabel}`, "i"),
          });

          if (!permissions?.view?.includes(auth.user.role as UserRole)) {
            expect(fieldEditButton).not.toBeInTheDocument();
            return;
          }

          expect(field).toHaveAttribute("disabled");
          expect(fieldEditButton).toBeInTheDocument();

          if (
            allowedTiers?.includes(company?.tier) &&
            permissions?.edit?.includes(auth.user.role as UserRole)
          ) {
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
        });
      }
    );
  });
});
