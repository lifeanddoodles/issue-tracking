import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect } from "vitest";
import Header from ".";

describe("Header", () => {
  test("renders correctly", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const element = screen.getByRole("banner");
    expect(element).toBeInTheDocument();
  });
});
