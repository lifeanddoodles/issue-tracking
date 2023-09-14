import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import Row from ".";

describe("Row", () => {
  test("renders correctly", () => {
    render(<Row>Row title</Row>);

    const element = screen.getByText("Row title");
    expect(element).toBeInTheDocument();
  });
});
