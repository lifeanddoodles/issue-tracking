import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";
import Button from ".";

describe("Button", () => {
  test("renders correctly", () => {
    render(<Button>Click</Button>);
    const element = screen.getByRole("button");

    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent("Click");
  });

  test("handles onClick event", async () => {
    user.setup();
    const mockOnClick = vi.fn();

    render(<Button onClick={mockOnClick}>Click</Button>);
    const element = screen.getByRole("button");

    await user.click(element);
    expect(mockOnClick).toHaveBeenCalledOnce();
  });
});
