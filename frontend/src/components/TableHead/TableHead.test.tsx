import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import TableHead from ".";
import Table from "../Table";
import TableHeading from "../TableHeading";
import TableRow from "../TableRow";

describe("TableHead", () => {
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

    const element = screen.getByRole("rowgroup");
    expect(element).toBeInTheDocument();
  });
});
