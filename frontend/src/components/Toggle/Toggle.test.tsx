import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { describe, expect } from "vitest";
import Toggle from ".";

describe("Toggle", () => {
  let mockChecked: boolean;
  let mockOnChange: () => void;
  let controlsProps: {
    onChange: () => void;
  };

  beforeEach(() => {
    mockChecked = false;
    mockOnChange = vi.fn(() => {
      mockChecked = !mockChecked;
    });
    controlsProps = {
      onChange: mockOnChange,
    };
  });

  test("renders correctly", () => {
    render(
      <Toggle
        label="My toggle:"
        id="my-toggle"
        onChange={controlsProps.onChange}
        checked={mockChecked}
      />
    );

    const element = screen.getByRole("checkbox");
    const label = screen.getByText(/my toggle/i);

    expect(element).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  test("updates value correctly", async () => {
    user.setup();

    render(
      <Toggle
        label="My toggle:"
        id="my-toggle"
        onChange={controlsProps.onChange}
        checked={mockChecked}
      />
    );

    const toggle = screen.getByRole("checkbox") as HTMLInputElement;

    expect(toggle.checked).toBe(false);

    await user.click(toggle);

    expect(mockOnChange).toHaveBeenCalled();
    expect(toggle.checked).toBe(true);
  });
});
