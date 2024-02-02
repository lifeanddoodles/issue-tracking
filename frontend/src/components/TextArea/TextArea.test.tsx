import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { describe, vi } from "vitest";
import TextArea from ".";

describe("TextArea", () => {
  let updatableErrors: { [key: string]: string[] } | null | undefined;
  let fieldProps: {
    label: string;
    id: string;
    onChange: () => void;
    value: string;
    errors: { [key: string]: string[] } | null | undefined;
    setErrors: () => void;
  };

  beforeEach(() => {
    updatableErrors = null;

    fieldProps = {
      label: "Description",
      id: "description",
      onChange: vi.fn(),
      value: "",
      errors: updatableErrors,
      setErrors: vi.fn(),
    };
  });

  test("renders correctly", () => {
    render(
      <TextArea
        label={fieldProps.label}
        id={fieldProps.id}
        onChange={fieldProps.onChange}
        value={fieldProps.value}
        errors={fieldProps.errors}
        setErrors={fieldProps.setErrors}
      />
    );

    const field = screen.getByRole("textbox");

    expect(field).toBeInTheDocument();
  });

  test("updates value", async () => {
    user.setup();

    render(
      <TextArea
        label={fieldProps.label}
        id={fieldProps.id}
        onChange={fieldProps.onChange}
        value={fieldProps.value}
        errors={fieldProps.errors}
        setErrors={fieldProps.setErrors}
      />
    );

    const field = screen.getByRole("textbox") as HTMLTextAreaElement;

    await user.type(field, "test");

    expect(field.value).toBe("test");
  });

  test("displays error", async () => {
    user.setup();

    const { rerender } = render(
      <TextArea
        label={fieldProps.label}
        id={fieldProps.id}
        onChange={fieldProps.onChange}
        value={fieldProps.value}
        errors={fieldProps.errors}
        setErrors={fieldProps.setErrors}
        required
      />
    );

    const field = screen.getByRole("textbox") as HTMLTextAreaElement;

    field.focus();
    await user.tab();

    updatableErrors = {
      description: ["Description is required"],
    };

    rerender(
      <TextArea
        label={fieldProps.label}
        id={fieldProps.id}
        onChange={fieldProps.onChange}
        value={fieldProps.value}
        errors={updatableErrors}
        setErrors={fieldProps.setErrors}
        required
      />
    );

    const fieldError = screen.getByText(/is required/i);
    expect(fieldError).toBeInTheDocument();
  });
});
