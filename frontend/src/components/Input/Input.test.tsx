import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";
import Input, { EmailInput } from ".";

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

  test("handles required error", async () => {
    user.setup();
    const mockHandleChange = vi.fn();
    let mockErrors = null;
    const mockSetErrors = vi.fn();

    const { rerender } = render(
      <Input
        label="First name:"
        type="text"
        id="firstName"
        onChange={mockHandleChange}
        errors={mockErrors}
        setErrors={mockSetErrors}
      />
    );
    const firstName = screen.getByRole("textbox") as HTMLInputElement;

    firstName.focus();
    await user.tab();

    mockErrors = {
      firstName: ["First name is required"],
    };

    rerender(
      <Input
        label="First name:"
        type="text"
        id="firstName"
        onChange={mockHandleChange}
        errors={mockErrors}
        setErrors={mockSetErrors}
      />
    );

    const firstNameError = screen.getByText(/First name is required/i);
    expect(firstNameError).toBeInTheDocument();
  });

  test("handles min length error", async () => {
    user.setup();
    const mockHandleChange = vi.fn();
    let mockErrors = null;
    const mockSetErrors = vi.fn();

    const { rerender } = render(
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

    await user.type(element, "a");

    mockErrors = {
      firstName: ["First name must be at least 2 characters"],
    };

    rerender(
      <Input
        label="First name:"
        type="text"
        id="firstName"
        onChange={mockHandleChange}
        errors={mockErrors}
        setErrors={mockSetErrors}
      />
    );

    const firstNameError = screen.getByText(
      /First name must be at least 2 characters/i
    );
    expect(firstNameError).toBeInTheDocument();
  });
});

describe("EmailInput", () => {
  test.each`
    value
    ${"a"}
    ${"a@b"}
    ${"a@b.c"}
  `(`given invalid email value $value, renders error`, async ({ value }) => {
    user.setup();
    const mockHandleChange = vi.fn();
    let mockErrors = null;
    const mockSetErrors = vi.fn();

    const { rerender } = render(
      <EmailInput
        label="Email:"
        id="email"
        onChange={mockHandleChange}
        value=""
        errors={mockErrors}
        setErrors={mockSetErrors}
      />
    );

    const element = screen.getByRole("textbox") as HTMLInputElement;

    await user.type(element, value);

    mockErrors = {
      email: ["Email must match the following pattern"],
    };

    rerender(
      <EmailInput
        label="Email:"
        id="email"
        onChange={mockHandleChange}
        value=""
        errors={mockErrors}
        setErrors={mockSetErrors}
      />
    );

    const emailError = await screen.findByText(
      /Email must match the following pattern/i
    );

    expect(emailError).toBeInTheDocument();
  });
});
