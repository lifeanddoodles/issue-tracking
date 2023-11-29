import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AllUsers from ".";

describe("AllUsers", () => {
  test("renders correctly ", async () => {
    act(() =>
      render(
        <MemoryRouter>
          <AllUsers />
        </MemoryRouter>
      )
    );
    const element = await screen.findByRole("table");
    expect(element).toBeInTheDocument();
  });
});
