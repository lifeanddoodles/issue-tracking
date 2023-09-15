import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { describe, expect } from "vitest";
import Select from ".";
import { fakeOptions } from "../../__mocks__";

describe("Select", () => {
  test("renders correctly", () => {
    render(<Select options={fakeOptions} />);

    const element = screen.getByRole("combobox");
    expect(element).toBeInTheDocument();
  });

  test("renders correct options amount", () => {
    render(<Select options={fakeOptions} />);

    const element = screen.getByRole("combobox");
    const options = element.querySelectorAll("option");
    expect(options.length).toBe(fakeOptions.length);
  });

  test("has initial value", () => {
    render(<Select value={fakeOptions[0].value} options={fakeOptions} />);

    const element = screen.getByRole("combobox") as HTMLSelectElement;
    expect(element.value).toBe(fakeOptions[0].value);
  });

  test("can change value", async () => {
    user.setup();
    render(<Select options={fakeOptions} />);

    const element = screen.getByRole("combobox") as HTMLSelectElement;
    const options = element.querySelectorAll("option");

    await user.selectOptions(element, options[1].value);

    expect(element.value).toBe(options[1].value);
  });
});
