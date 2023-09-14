import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";
import Input from ".";

describe("Input", () => {
  test("renders correctly", () => {
    const fakeValue = "";
    const mockHandleChange = vi.fn();
    const mockErrors = null;
    const mockSetErrors = vi.fn();

    render(
      <Input
        label="First name:"
        type="text"
        id="firstName"
        onChange={mockHandleChange}
        value={fakeValue}
        errors={mockErrors}
        setErrors={mockSetErrors}
      />
    );
    const element = screen.getByRole("textbox") as HTMLInputElement;

    expect(element).toBeInTheDocument();
  });

  test("renders initial value correctly", () => {
    const fakeValue = "testValue";
    const mockHandleChange = vi.fn();
    const mockErrors = null;
    const mockSetErrors = vi.fn();

    render(
      <Input
        label="First name:"
        type="text"
        id="firstName"
        onChange={mockHandleChange}
        value={fakeValue}
        errors={mockErrors}
        setErrors={mockSetErrors}
      />
    );

    const element = screen.getByRole("textbox") as HTMLInputElement;
    expect(element.value).toBe(fakeValue);
  });

  test("updates value", async () => {
    user.setup();
    const mockHandleChange = vi.fn();
    const mockErrors = null;
    const mockSetErrors = vi.fn();

    render(
      <Input
        label="First name:"
        type="text"
        id="firstName"
        onChange={mockHandleChange}
        errors={mockErrors}
        setErrors={mockSetErrors}
      />
    );
    const element = screen.getByRole("textbox") as HTMLInputElement;

    await user.type(element, "test");
    expect(element.value).toBe("test");
  });
});
