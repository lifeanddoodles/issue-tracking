import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AllTickets from ".";

describe("AllTickets", () => {
  test("renders correctly", async () => {
    act(() =>
      render(
        <MemoryRouter>
          <AllTickets />
        </MemoryRouter>
      )
    );
    const element = await screen.findByRole("table");
    expect(element).toBeInTheDocument();
  });
});
