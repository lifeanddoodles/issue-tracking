import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import { fakeUsers } from "../../__mocks__";
import { getFullName, getInitials } from "../../utils";
import Avatar from "./";

const fakeUser = fakeUsers[0];
const fakeUserWithImage = {
  ...fakeUsers[0],
  avatarUrl: "https://placehold.co/400",
};

describe("Avatar", () => {
  test("renders correctly", () => {
    const initials = getInitials(fakeUser.firstName, fakeUser.lastName);
    render(
      <Avatar firstName={fakeUser.firstName} lastName={fakeUser.lastName} />
    );
    const element = screen.getByText(initials);
    expect(element).toBeInTheDocument();
  });

  test("renders accessible image if URL is provided", () => {
    const fullName = getFullName(
      fakeUserWithImage.firstName,
      fakeUserWithImage.lastName
    );
    render(
      <Avatar
        firstName={fakeUserWithImage.firstName}
        lastName={fakeUserWithImage.lastName}
        imageUrl={fakeUserWithImage.avatarUrl}
      />
    );
    const element = screen.getByAltText(`Profile image of ${fullName}`);
    expect(element).toBeInTheDocument();
  });
});
