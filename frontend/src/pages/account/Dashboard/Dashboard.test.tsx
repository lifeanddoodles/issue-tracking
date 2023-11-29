import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect } from "vitest";
import Dashboard from ".";
import { fakeTickets } from "../../../__mocks__";

describe("Dashboard", () => {
  test("renders correctly", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const title = screen.getByRole("heading", { name: "Dashboard" });
    const notificationsSectionTitle = screen.getByRole("heading", {
      name: /notifications/i,
    });
    const ticketsSectionTitle = screen.getByRole("heading", {
      name: /tickets/i,
    });

    const elements = [title, notificationsSectionTitle, ticketsSectionTitle];

    for (const element of elements) {
      expect(element).toBeInTheDocument();
    }
  });

  test("shows tickets list", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const ticketsList = await screen.findByRole("list");
    const tickets = await screen.findAllByRole("listitem");

    expect(ticketsList).toBeInTheDocument();
    expect(tickets).toHaveLength(fakeTickets.length);
  });
});
