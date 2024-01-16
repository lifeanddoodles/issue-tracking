import { act, fireEvent, render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import {
  IAddressInfo,
  ICompanyDocument,
  IUserDocument,
} from "shared/interfaces";
import CompanyDetails from ".";
import {
  fakeAdminUser,
  fakeClientUserNoCompany,
  fakeCompanies,
} from "../../../../__mocks__";
import AuthContext from "../../../../context/AuthContext";
import { FormElement } from "../../../../interfaces";
import { getReadableInputName } from "../../../../utils";

const compareValue: <T>(
  elementToTest: FormElement,
  dataObj: Partial<T>,
  id: keyof T
) => void = (elementToTest, dataObj, id) => {
  if (dataObj[id] === undefined) {
    expect(elementToTest.value).toBe("");
  } else {
    expect(elementToTest.value).toBe(dataObj[id]);
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

    test("renders fields with the data", async () => {
      act(() =>
        render(
          <MemoryRouter>
            <AuthContext.Provider value={auth}>
              <CompanyDetails />
            </AuthContext.Provider>
          </MemoryRouter>
        )
      );

      const company = fakeCompanies.find(
        (company) => company._id === auth.user.company
      );

      const title = await screen.findByRole("heading", {
        name: "Company Details",
      });
      const name = await screen.findByLabelText(
        RegExp(`^${getReadableInputName("name")}`, "i")
      );
      const subscriptionStatus = await screen.findByLabelText(
        RegExp(`^${getReadableInputName("subscriptionStatus")}`, "i")
      );
      const email = await screen.findByLabelText(
        RegExp(`^${getReadableInputName("email")}`, "i")
      );
      const addressStreet = await screen.findByLabelText(
        RegExp(`^${getReadableInputName("address.street")}`, "i")
      );
      const addressCity = await screen.findByLabelText(
        RegExp(`^${getReadableInputName("address.city")}`, "i")
      );
      const addressState = await screen.findByLabelText(
        RegExp(`^${getReadableInputName("address.state")}`, "i")
      );
      const addressZip = await screen.findByLabelText(
        RegExp(`^${getReadableInputName("address.zip")}`, "i")
      );
      const addressCountry = await screen.findByLabelText(
        RegExp(`^${getReadableInputName("address.country")}`, "i")
      );
      const dba = await screen.findByLabelText(
        RegExp(`^${getReadableInputName("dba")}`, "i")
      );
      const industry = await screen.findByLabelText(
        RegExp(`^${getReadableInputName("industry")}`, "i")
      );
      const description = await screen.findByLabelText(
        RegExp(`^${getReadableInputName("description")}`, "i")
      );
      const newEmployee = await screen.findByLabelText(
        RegExp(`^${getReadableInputName("newEmployee")}`, "i")
      );

      const elements = [
        title,
        name,
        subscriptionStatus,
        email,
        addressStreet,
        addressCity,
        addressState,
        addressZip,
        addressCountry,
        dba,
        industry,
        description,
        newEmployee,
      ];

      for (const element of elements) {
        expect(element as FormElement).toBeInTheDocument();
        if (element.hasAttribute("value")) {
          if (element.id.startsWith("address.")) {
            const addressKey = element.id.replace("address.", "");
            compareValue<IAddressInfo>(
              element as FormElement,
              company!.address,
              addressKey as keyof IAddressInfo
            );
          } else {
            compareValue<ICompanyDocument>(
              element as FormElement,
              company! as Partial<ICompanyDocument>,
              element.id as keyof ICompanyDocument
            );
          }
        }
      }
    });

    test.each`
      fieldId                 | newFieldValue
      ${"name"}               | ${"New name"}
      ${"email"}              | ${"new@email.com"}
      ${"description"}        | ${"New description"}
      ${"subscriptionStatus"} | ${"1"}
      ${"address.street"}     | ${"New street"}
    `(
      "when on edit mode, can change $fieldId field's value",
      async ({ fieldId, newFieldValue }) => {
        user.setup();

        const { rerender } = render(
          <MemoryRouter>
            <AuthContext.Provider value={auth}>
              <CompanyDetails />
            </AuthContext.Provider>
          </MemoryRouter>
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

        if (
          field instanceof HTMLInputElement ||
          field instanceof HTMLTextAreaElement
        ) {
          expect(field).not.toHaveAttribute("disabled");

          await user.clear(field);
          await user.type(field, newFieldValue);
          expect(field.value).toBe(newFieldValue);
        }

        if (field instanceof HTMLSelectElement) {
          expect(field).toHaveAttribute("disabled", "");

          const options = Array.from(
            (field as HTMLSelectElement).querySelectorAll("option")
          );

          await act(async () => {
            fireEvent.select(field, {
              target: { value: options[newFieldValue].value },
            });
          });

          rerender(
            <MemoryRouter>
              <AuthContext.Provider value={auth}>
                <CompanyDetails />
              </AuthContext.Provider>
            </MemoryRouter>
          );

          expect(field.value).toBe(options[newFieldValue].value);
        }
      }
    );

    /* TODO: Debug select fields
     * Endpoint should be called with { [fieldId]: newFieldValue }
     */
    test.skip.each`
      fieldId                 | newFieldValue
      ${"name"}               | ${"New name"}
      ${"email"}              | ${"new@email.com"}
      ${"description"}        | ${"New description"}
      ${"subscriptionStatus"} | ${"1"}
      ${"industry"}           | ${"1"}
      ${"address.street"}     | ${"New street"}
    `(
      "when saving changes on $fieldId, the correct data is sent to the server",
      async ({ fieldId, newFieldValue }) => {
        user.setup();

        const { rerender } = render(
          <MemoryRouter>
            <AuthContext.Provider value={auth}>
              <CompanyDetails />
            </AuthContext.Provider>
          </MemoryRouter>
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

        if (
          field instanceof HTMLInputElement ||
          field instanceof HTMLTextAreaElement
        ) {
          expect(field).not.toHaveAttribute("disabled");

          await user.clear(field);
          await user.type(field, newFieldValue);
          expect(field.value).toBe(newFieldValue);
          await user.click(fieldSaveButton!);
        }

        if (field instanceof HTMLSelectElement) {
          expect(field).toHaveAttribute("disabled", "");

          const options = Array.from(
            (field as HTMLSelectElement).querySelectorAll("option")
          );

          await act(async () => {
            fireEvent.select(field, {
              target: { value: options[newFieldValue].value },
            });
          });

          rerender(
            <MemoryRouter>
              <AuthContext.Provider value={auth}>
                <CompanyDetails />
              </AuthContext.Provider>
            </MemoryRouter>
          );

          expect(field.value).toBe(options[newFieldValue].value);
          await user.click(fieldSaveButton!);
        }
      }
    );

    test("when on edit mode, can cancel changes", async () => {
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

      const company = fakeCompanies.find(
        (company) => company._id === auth.user.company
      );

      const name = (await screen.findByLabelText(
        RegExp(`^${getReadableInputName("name")}`, "i")
      )) as HTMLInputElement;
      const nameEditButton = await screen.findByRole("button", {
        name: RegExp(`^edit ${getReadableInputName("name")}`, "i"),
      });
      const nameCancelButton = await screen.findByRole("button", {
        name: RegExp(`^cancel changes to ${getReadableInputName("name")}`, "i"),
      });

      expect(name).toHaveAttribute("disabled");
      expect(nameEditButton).toBeInTheDocument();
      await user.click(nameEditButton);

      await user.clear(name);
      await user.type(name, "New Company Name");
      expect(name.value).toBe("New Company Name");

      await user.click(nameCancelButton);
      expect(name.value).toBe(company?.name);
    });
  });
});
