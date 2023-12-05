import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AllCompanies from ".";

describe("AllCompanies", () => {
  test("renders correctly", async () => {
    act(() =>
      render(
        <MemoryRouter>
          <AllCompanies />
        </MemoryRouter>
      )
    );
    const element = await screen.findByRole("table");
    expect(element).toBeInTheDocument();
  });
});
