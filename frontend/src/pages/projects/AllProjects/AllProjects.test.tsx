import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AllProjects from ".";

describe("AllProjects", () => {
  test("renders correctly", async () => {
    act(() =>
      render(
        <MemoryRouter>
          <AllProjects />
        </MemoryRouter>
      )
    );
    const element = await screen.findByRole("table");
    expect(element).toBeInTheDocument();
  });
});
