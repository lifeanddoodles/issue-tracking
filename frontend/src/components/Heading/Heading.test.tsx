import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import Heading from ".";

describe("Heading", () => {
  test("renders correctly", () => {
    render(<Heading text="Heading" />);

    const element = screen.getByRole("heading");
    expect(element).toBeInTheDocument();
  });

  test("has correct level", () => {
    render(<Heading text="Heading" level={3} />);

    const element = screen.getByRole("heading", {
      level: 3,
    }) as HTMLHeadingElement;
    expect(element).toBeInTheDocument();
  });
});
