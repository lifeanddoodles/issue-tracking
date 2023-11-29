import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AllServices from ".";

describe("AllServices", () => {
  test("renders correctly", async () => {
    act(() =>
      render(
        <MemoryRouter>
          <AllServices />
        </MemoryRouter>
      )
    );
    const element = await screen.findByRole("table");
    expect(element).toBeInTheDocument();
  });
});
