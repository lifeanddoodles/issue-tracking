import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import user from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ICompanyDocument, IUserDocument } from "shared/interfaces";
import { vi } from "vitest";
import CompanyDetails from ".";
import {
  fakeAdminUser,
  fakeClientUserNoCompany,
  fakeCompanies,
} from "../../../../__mocks__";
import AuthContext from "../../../../context/AuthContext";
import useResourceInfo from "../../../../hooks/useResourceInfo";
import { FormElement } from "../../../../interfaces";
import { COMPANIES_BASE_API_URL } from "../../../../routes";
import { getReadableInputName, getValue } from "../../../../utils";

vi.mock("../../../../hooks/useResourceInfo");

const compareValue: <T>(
  elementValue: unknown,
  dataObj: Partial<T>,
  id: keyof T
) => void = (elementValue, dataObj, id) => {
  const dataValue = getValue(id as string, dataObj);
  if (dataValue === undefined || dataValue === "") {
    expect(elementValue).toBe("");
  } else {
    expect(elementValue).toBe(dataValue);
  }
};

const authBase = {
  error: null,
  loading: false,
  authUserReq: () => {},
  logoutUserReq: () => {},
};

describe("CompanyDetails", () => {
  describe("if company does not exist", async () => {
    beforeEach(() => {
      vi.mocked(useResourceInfo)
        .mockClear()
        .mockImplementation(() => ({
          data: null,
          loading: false,
          error: new Error("Error"),
          requestGetResource: vi.fn(),
          requestUpdateResource: vi.fn(),
          requestDeleteResource: vi.fn(),
        }));
    });

    test("renders error", async () => {
      const auth = {
        user: {
          ...fakeClientUserNoCompany,
        } as IUserDocument,
        ...authBase,
      };

      act(() =>
        render(
          <MemoryRouter>
            <AuthContext.Provider value={auth}>
              <CompanyDetails />
            </AuthContext.Provider>
          </MemoryRouter>
        )
      );

      const title = await screen.findByText(/error/i);
      const notApplicableTitle = screen.queryByText(/company details/i);

      expect(title).toBeInTheDocument();
      expect(notApplicableTitle).not.toBeInTheDocument();
    });
  });

  describe("if company exists", async () => {
    const auth = {
      user: {
        ...fakeAdminUser,
      } as IUserDocument,
      ...authBase,
    };

    const company = fakeCompanies.find(
      (company) => company._id === auth.user.company
    );

    const requestUpdateResourceMock = vi.fn(async () => {
      return Promise.resolve();
    });

    beforeEach(() => {
      vi.mocked(useResourceInfo)
        .mockClear()
        .mockImplementation(() => ({
          data: company,
          loading: false,
          error: null,
          requestGetResource: vi.fn(),
          requestUpdateResource: requestUpdateResourceMock,
          requestDeleteResource: vi.fn(),
        }));
    });

    const updateInputOrTextarea = async (
      field: FormElement,
      newFieldValue: string
    ) => {
      await user.clear(field);
      await user.type(field, newFieldValue);
    };

    const updateSelect = async (
      field: FormElement,
      options: HTMLOptionElement[],
      newFieldValue: number
    ) => {
      act(() =>
        fireEvent.select(field, {
          target: { value: options[newFieldValue as number].value },
        })
      );
    };

    const updateFieldAndCheckValue = async (
      field: FormElement,
      newFieldValue: string | number
    ) => {
      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement
      ) {
        await updateInputOrTextarea(field, newFieldValue as string);

        expect(field.value).toBe(newFieldValue);
      }

      if (field instanceof HTMLSelectElement) {
        expect(field).toHaveAttribute("disabled", "");

        const options = Array.from(
          (field as HTMLSelectElement).querySelectorAll("option")
        );
        await updateSelect(field, options, newFieldValue as number);

        expect(field.value).toBe(options[newFieldValue as number].value);
      }
    };

    test.each`
      fieldId                 | findBy
      ${"heading"}            | ${"role"}
      ${"name"}               | ${"text"}
      ${"subscriptionStatus"} | ${"text"}
      ${"email"}              | ${"text"}
      ${"address.street"}     | ${"text"}
      ${"address.city"}       | ${"text"}
      ${"address.state"}      | ${"text"}
      ${"address.zip"}        | ${"text"}
      ${"address.country"}    | ${"text"}
      ${"dba"}                | ${"text"}
      ${"industry"}           | ${"text"}
      ${"description"}        | ${"text"}
      ${"newEmployee"}        | ${"text"}
    `(
      "renders $fieldId with the correct value",
      async ({ fieldId, findBy }) => {
        act(() =>
          render(
            <MemoryRouter>
              <AuthContext.Provider value={auth}>
                <CompanyDetails />
              </AuthContext.Provider>
            </MemoryRouter>
          )
        );

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

    test.each`
      fieldId                 | newFieldValue
      ${"name"}               | ${"New name"}
      ${"email"}              | ${"new@email.com"}
      ${"description"}        | ${"New description"}
      ${"subscriptionStatus"} | ${"1"}
      ${"address.street"}     | ${"New street"}
      ${"address.city"}       | ${"New city"}
      ${"address.state"}      | ${"New state"}
      ${"address.zip"}        | ${"11111"}
      ${"address.country"}    | ${"New country"}
      ${"dba"}                | ${"New DBA"}
      ${"industry"}           | ${"1"}
      ${"newEmployee"}        | ${"1"}
    `(
      "when on edit mode, can change $fieldId field's value",
      async ({ fieldId, newFieldValue }) => {
        user.setup();

        act(() =>
          render(
            <MemoryRouter>
              <AuthContext.Provider value={auth}>
                <CompanyDetails />
              </AuthContext.Provider>
            </MemoryRouter>
          )
        );

        const fieldLabel = getReadableInputName(fieldId);
        const field = (await screen.findByLabelText(
          RegExp(`^${fieldLabel}`, "i")
        )) as FormElement;
        const fieldEditButton = screen.queryByRole("button", {
          name: RegExp(`^edit ${fieldLabel}`, "i"),
        });

        expect(field).toHaveAttribute("disabled");
        expect(fieldEditButton).toBeInTheDocument();

        await user.click(fieldEditButton!);
        expect(
          screen.queryByRole("button", {
            name: RegExp(`^edit ${fieldLabel}`, "i"),
          })
        ).not.toBeInTheDocument();

        const fieldSaveButton = screen.queryByRole("button", {
          name: RegExp(`^save ${fieldLabel}`, "i"),
        });

        expect(fieldSaveButton).toBeInTheDocument();

        await act(() => updateFieldAndCheckValue(field, newFieldValue));
      }
    );

    /**
     * TODO: Fix failing tests for the select fields:
     * - subscriptionStatus
     * - industry
     * - newEmployee
     */
    test.each`
      fieldId              | newFieldValue
      ${"name"}            | ${"New name"}
      ${"email"}           | ${"new@email.com"}
      ${"description"}     | ${"New description"}
      ${"address.street"}  | ${"New street"}
      ${"address.city"}    | ${"New city"}
      ${"address.state"}   | ${"New state"}
      ${"address.zip"}     | ${"11111"}
      ${"address.country"} | ${"New country"}
      ${"dba"}             | ${"New DBA"}
    `(
      "when saving changes on $fieldId, the correct data is sent to the server",
      async ({ fieldId, newFieldValue }) => {
        user.setup();

        act(() =>
          render(
            <MemoryRouter>
              <AuthContext.Provider value={auth}>
                <CompanyDetails />
              </AuthContext.Provider>
            </MemoryRouter>
          )
        );

        const fieldLabel = getReadableInputName(fieldId);
        const field = (await screen.findByLabelText(
          RegExp(`^${fieldLabel}`, "i")
        )) as FormElement;
        const fieldEditButton = screen.queryByRole("button", {
          name: RegExp(`^edit ${fieldLabel}`, "i"),
        });

        expect(field).toHaveAttribute("disabled");
        expect(fieldEditButton).toBeInTheDocument();

        await user.click(fieldEditButton!);

        expect(
          screen.queryByRole("button", {
            name: RegExp(`^edit ${fieldLabel}`, "i"),
          })
        ).not.toBeInTheDocument();

        const fieldSaveButton = screen.queryByRole("button", {
          name: RegExp(`^save ${fieldLabel}`, "i"),
        });

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
        });

        expect(requestUpdateResourceMock).toHaveBeenCalledWith({
          url: `${COMPANIES_BASE_API_URL}/${company!._id}`,
          body,
        });
      }
    );

    /**
     * TODO: Fix failing tests for the select fields:
     * - subscriptionStatus
     * - industry
     * - newEmployee
     */
    test.each`
      fieldId              | newFieldValue
      ${"name"}            | ${"New name"}
      ${"email"}           | ${"new@email.com"}
      ${"description"}     | ${"New description"}
      ${"address.street"}  | ${"New street"}
      ${"address.city"}    | ${"New city"}
      ${"address.state"}   | ${"New state"}
      ${"address.zip"}     | ${"11111"}
      ${"address.country"} | ${"New country"}
      ${"dba"}             | ${"New DBA"}
    `(
      "when on edit mode, can cancel changes on $fieldId field's value",
      async ({ fieldId, newFieldValue }) => {
        user.setup();

        act(() =>
          render(
            <MemoryRouter>
              <AuthContext.Provider value={auth}>
                <CompanyDetails />
              </AuthContext.Provider>
            </MemoryRouter>
          )
        );

        const fieldLabel = getReadableInputName(fieldId);
        const field = (await screen.findByLabelText(
          RegExp(`^${fieldLabel}`, "i")
        )) as FormElement;
        const fieldEditButton = screen.queryByRole("button", {
          name: RegExp(`^edit ${fieldLabel}`, "i"),
        });
        const fieldCancelButton = await screen.findByRole("button", {
          name: RegExp(`^cancel changes to ${fieldLabel}`, "i"),
        });

        expect(fieldCancelButton).toBeInTheDocument();

        await act(async () => {
          await user.click(fieldEditButton!);
        });

        await act(() => updateFieldAndCheckValue(field, newFieldValue));

        await act(async () => {
          await user.click(fieldCancelButton!);
        });

        await waitFor(() => {
          compareValue<ICompanyDocument>(field.value, company!, fieldId);
        });
      }
    );
  });
});
