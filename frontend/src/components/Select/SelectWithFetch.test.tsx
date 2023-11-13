import { act, render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";
import { fakeUsers } from "../../__mocks__";
import { USERS_BASE_API_URL } from "../../routes";
import { getUserDataOptions } from "../../utils";
import SelectWithFetch from "./SelectWithFetch";

describe("SelectWithFetch", () => {
  test("renders correctly", async () => {
    const errors = {};
    const mockOnChange = vi.fn();

    act(() =>
      render(
        <SelectWithFetch
          label="Assignee:"
          id="assignee"
          value={""}
          onChange={mockOnChange}
          errors={errors}
          url={USERS_BASE_API_URL}
          getFormattedOptions={getUserDataOptions}
        />
      )
    );

    const element = await screen.findByRole("combobox");
    expect(element).toBeInTheDocument();
  });

  test("has correct options amount", async () => {
    const errors = {};
    const mockOnChange = vi.fn();

    act(() =>
      render(
        <SelectWithFetch
          label="Assignee:"
          id="assignee"
          value={""}
          onChange={mockOnChange}
          errors={errors}
          url={USERS_BASE_API_URL}
          getFormattedOptions={getUserDataOptions}
        />
      )
    );

    const options = await screen.findAllByRole("option");
    // Take into account the default empty option
    expect(options.length).toEqual(fakeUsers.length + 1);
  });

  test("has default option", async () => {
    const errors = {};
    const mockOnChange = vi.fn();

    act(() =>
      render(
        <SelectWithFetch
          label="Assignee:"
          id="assignee"
          value={""}
          onChange={mockOnChange}
          errors={errors}
          url={USERS_BASE_API_URL}
          getFormattedOptions={getUserDataOptions}
        />
      )
    );

    const select = (await screen.findByRole("combobox")) as HTMLSelectElement;
    expect(select.value).toEqual("");
  });

  test("can change value", async () => {
    user.setup();
    const errors = {};
    const mockOnChange = vi.fn();

    act(() =>
      render(
        <SelectWithFetch
          label="Assignee:"
          id="assignee"
          value={""}
          onChange={mockOnChange}
          errors={errors}
          url={USERS_BASE_API_URL}
          getFormattedOptions={getUserDataOptions}
        />
      )
    );

    const select = (await screen.findByRole("combobox")) as HTMLSelectElement;
    const options = (await screen.findAllByRole(
      "option"
    )) as HTMLOptionElement[];

    // Select another option
    await user.selectOptions(select, options[1].value);
    // Take into account the default empty option added in the component
    // and compare values with appropriate offset in the dummy data's index
    expect(select.value).toEqual(fakeUsers[0]._id);
  });
});
