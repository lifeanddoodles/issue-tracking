import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import TableCell from ".";
import Table from "../Table";
import TableBody from "../TableBody";
import TableRow from "../TableRow";

describe("TableCell", () => {
  test("renders correctly", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell data</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const element = screen.getByRole("cell");
    expect(element).toBeInTheDocument();
  });
});
