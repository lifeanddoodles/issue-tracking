import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import Badge from "./";

describe("Badge", () => {
  test("renders correctly", () => {
    render(<Badge text="Badge text" />);
    const element = screen.getByText("Badge text");
    expect(element).toBeInTheDocument();
  });
});
