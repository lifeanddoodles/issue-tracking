import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import Column from ".";

describe("Column", () => {
  test("renders correctly", () => {
    render(
      <Column>
        <p>Column title</p>
      </Column>
    );

    const element = screen.getByText("Column title");
    expect(element).toBeInTheDocument();
  });
});
