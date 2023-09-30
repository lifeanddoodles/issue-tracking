import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import TableHeading from ".";
import Table from "../Table";
import TableHead from "../TableHead";
import TableRow from "../TableRow";

describe("TableHeading", () => {
  test("renders correctly", () => {
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeading>Column title</TableHeading>
          </TableRow>
        </TableHead>
      </Table>
    );

    const element = screen.getByRole("columnheader");
    expect(element).toBeInTheDocument();
  });
});
