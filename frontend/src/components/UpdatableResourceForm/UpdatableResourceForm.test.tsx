import { act, render, screen, within } from "@testing-library/react";
import { describe, expect } from "vitest";
import { fakeCompanies } from "../../__mocks__";
import { COMPANIES_BASE_API_URL } from "../../routes";
import { TextInput, UrlInput } from "../Input";
import UpdatableResourceForm from "./";

const company = fakeCompanies[0];
type FormShape = { [key: string]: string };

describe("UpdatableResourceForm", () => {
  const resourceUrl = COMPANIES_BASE_API_URL;
  const resourceId = company._id;
  const resourceName = "company";
  const mockOnChange = vi.fn();

  const formShape: FormShape = {
    name: company.name,
    url: company.url,
  };

  const fields = [
    {
      Component: TextInput,
      label: "Name:",
      id: "name",
      required: true,
    },
    {
      Component: UrlInput,
      label: "URL:",
      id: "url",
      required: true,
    },
  ];

  const fieldIds = fields.map((field) => field.id);
  const renderedChildren = fields.map(({ Component, id, ...otherProps }) => {
    const value = formShape[id];
    return <Component {...otherProps} id={id} value={value} key={id} />;
  });

  test("renders correctly", async () => {
    await act(() =>
      render(
        <UpdatableResourceForm
          resourceUrl={resourceUrl}
          resourceId={resourceId}
          resourceName={resourceName}
          onChange={mockOnChange}
          formShape={formShape}
        >
          {renderedChildren}
        </UpdatableResourceForm>
      )
    );

    const title = screen.getByRole("heading", {
      name: RegExp(`${resourceName} details`, "i"),
    });
    const form = screen.getByRole("form", {
      name: `${resourceName}-details-form`,
    });

    expect(title).toBeInTheDocument();
    expect(form).toBeInTheDocument();
  });

  test("renders modified fields", async () => {
    await act(() =>
      render(
        <UpdatableResourceForm
          resourceUrl={resourceUrl}
          resourceId={resourceId}
          resourceName={resourceName}
          onChange={mockOnChange}
          formShape={formShape}
        >
          {renderedChildren}
        </UpdatableResourceForm>
      )
    );

    const form = screen.getByRole("form", {
      name: `${resourceName}-details-form`,
    });

    for (const fieldId of fieldIds) {
      const fieldGroup = within(form).getByTestId(fieldId);
      const fieldGroupChildren = Array.from(
        fieldGroup.children
      ) as HTMLElement[];
      const controlsGroup = fieldGroupChildren[1];
      const editButton = within(controlsGroup).getByRole("button", {
        name: /edit/i,
      });
      const cancelButton = within(controlsGroup).getByRole("button", {
        name: /cancel/i,
      });

      expect(fieldGroup).toBeInTheDocument();
      expect(fieldGroupChildren.length).toEqual(2);
      expect(editButton).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
    }
  });
});
