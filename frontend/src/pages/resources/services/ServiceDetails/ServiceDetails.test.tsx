import { act, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import { IServiceDocument, IUserDocument } from "shared/interfaces";
import { vi } from "vitest";
import ServiceDetails from ".";
import { fakeClientUserNoCompany, fakeServices } from "../../../../__mocks__";
import {
  getUseResourceInfoMockReturnValue,
  requestUpdateResourceMock,
  useResourceInfoMockReturnWithError,
  useResourceInfoMockReturnWithSuccess,
} from "../../../../__mocks__/useResourceInfo";
import useResourceInfo from "../../../../hooks/useResourceInfo";
import { FormElement, ResourceState } from "../../../../interfaces";
import { SERVICES_BASE_API_URL } from "../../../../routes";
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
  { fieldId: "url", newFieldValue: "https://new-url.com" },
  { fieldId: "description", newFieldValue: "New description" },
  { fieldId: "version", newFieldValue: "1.0.1" },
  { fieldId: "tier", newFieldValue: "1" },
];

const fieldsToTestNoSelects = [
  { fieldId: "name", newFieldValue: "New name" },
  { fieldId: "url", newFieldValue: "https://new-url.com" },
  { fieldId: "description", newFieldValue: "New description" },
  { fieldId: "version", newFieldValue: "1.0.1" },
];

describe("ServiceDetails", () => {
  let auth: IAuthContext;
  let useResourceInfoMockReturn: ResourceState<unknown>;

  describe("if service does not exist", async () => {
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
      act(() => renderWithRouter(<ServiceDetails />, auth));

      const title = await screen.findByText(/error/i);
      const notApplicableTitle = screen.queryByText(/service details/i);

      expect(title).toBeInTheDocument();
      expect(notApplicableTitle).not.toBeInTheDocument();
    });
  });

  describe("if service exists", async () => {
    let service: IServiceDocument;

    beforeAll(() => {
      vi.clearAllMocks();
    });

    beforeEach(async () => {
      auth = {
        ...adminAuth,
      };

      service = fakeServices[0] as IServiceDocument;

      useResourceInfoMockReturn = useResourceInfoMockReturnWithSuccess(service);

      await getUseResourceInfoMockReturnValue(
        useResourceInfo,
        useResourceInfoMockReturn
      );
    });

    test.each`
      fieldId          | findBy
      ${"heading"}     | ${"role"}
      ${"name"}        | ${"label"}
      ${"url"}         | ${"label"}
      ${"description"} | ${"label"}
      ${"version"}     | ${"label"}
      ${"tier"}        | ${"label"}
    `(
      "renders $fieldId with the correct value",
      async ({ fieldId, findBy }) => {
        act(() => renderWithRouter(<ServiceDetails />, auth));

        await waitFor(async () => {
          if (findBy === "role") {
            const title = await screen.findByRole(fieldId, {
              name: "Service Details",
            });
            expect(title).toBeInTheDocument();
          }

          if (findBy === "label") {
            const field = (await screen.findByLabelText(
              RegExp(`^${getReadableInputName(fieldId)}`, "i")
            )) as FormElement;

            expect(field).toBeInTheDocument();
            compareValue<IServiceDocument>(field.value, service!, fieldId);
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

        act(() => renderWithRouter(<ServiceDetails />, auth));

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
     * - tier
     */
    testEach(
      fieldsToTestNoSelects,
      "when saving changes on $fieldId, the correct data is sent to the server",
      async ({ fieldId, newFieldValue }) => {
        user.setup();

        act(() =>
          renderWithRouterFromRoute(
            componentWithAuthContext(<ServiceDetails />, auth),
            [`/services/${service?._id}`],
            "/services/:serviceId"
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

        const body = {
          [fieldId]: newFieldValue,
        };

        await waitFor(async () => {
          expect(requestUpdateResourceMock).toHaveBeenCalled();
          expect(requestUpdateResourceMock).toHaveBeenCalledWith({
            url: `${SERVICES_BASE_API_URL}/${service?._id}`,
            body,
          });
        });
      }
    );

    /**
     * Test cancel changes functionality
     *
     * TODO: Fix failing tests for the select fields:
     * - tier
     */
    testEach(
      fieldsToTestNoSelects,
      "when on edit mode, can cancel changes on $fieldId field's value",
      async ({ fieldId, newFieldValue }) => {
        user.setup();

        act(() => renderWithRouter(<ServiceDetails />, auth));

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
          compareValue<IServiceDocument>(
            field.value,
            service!,
            fieldId as keyof IServiceDocument
          );
        });
      }
    );
  });
});
