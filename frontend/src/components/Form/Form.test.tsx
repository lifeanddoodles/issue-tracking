import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";
import Form from ".";
import Button from "../Button";

describe("Form", () => {
  test("renders correctly", () => {
    render(
      <Form>
        <h1>Form tile</h1>
      </Form>
    );

    const element = screen.getByText(/form tile/i);
    expect(element).toBeInTheDocument();
  });

  test("handles submit event", async () => {
    user.setup();
    const mockOnSubmit = vi.fn((e) => e.preventDefault());
    render(
      <Form onSubmit={mockOnSubmit}>
        <h1>Form tile</h1>
        <Button type={"submit"}>Submit</Button>
      </Form>
    );
    const submitButton = screen.getByRole("button");
    await user.click(submitButton);
    expect(mockOnSubmit).toHaveBeenCalledOnce();
  });
});
