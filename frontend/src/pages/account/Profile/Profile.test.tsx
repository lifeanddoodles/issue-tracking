import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Mock, describe, expect, vi } from "vitest";
import Profile from ".";
import { IUserDocument } from "../../../../../shared/interfaces";
import { fakeDevUser } from "../../../__mocks__";
import mockedUseProfileData from "../../../hooks/useProfileData";

vi.mock(`../../../hooks/useProfileData`);

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actualReactRouterDom: Record<string, unknown> = await vi.importActual(
    `react-router-dom`
  );

  return {
    ...actualReactRouterDom,
    useNavigate: (): Mock => useNavigateMock,
  };
});

describe("Profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("if user exists", () => {
    beforeEach(() => {
      vi.mocked(mockedUseProfileData)
        .mockClear()
        .mockImplementation(() => ({
          userInfo: fakeDevUser as IUserDocument,
          loading: false,
          error: null,
          getUserInfo: vi.fn(),
        }));
    });
    test("renders correctly", async () => {
      await act(() =>
        render(
          <MemoryRouter>
            <Profile />
          </MemoryRouter>
        )
      );

      const title = screen.getByRole("heading", { name: /profile/i });
      const firstName = screen.getByRole("textbox", { name: /first name/i });
      const lastName = screen.getByRole("textbox", { name: /last name/i });
      const email = screen.getByRole("textbox", { name: /email/i });
      expect(title).toBeInTheDocument();
      expect(firstName).toBeInTheDocument();
      expect(firstName).toHaveValue(fakeDevUser.firstName);
      expect(lastName).toBeInTheDocument();
      expect(lastName).toHaveValue(fakeDevUser.lastName);
      expect(email).toBeInTheDocument();
      expect(email).toHaveValue(fakeDevUser.email);
    });
  });

  describe("if user does not exist", () => {
    beforeEach(() => {
      vi.mocked(mockedUseProfileData)
        .mockClear()
        .mockImplementation(() => ({
          userInfo: null,
          loading: false,
          error: new Error("User not found"),
          getUserInfo: vi.fn(),
        }));
    });
    test("throws error", async () => {
      act(() =>
        render(
          <MemoryRouter>
            <Profile />
          </MemoryRouter>
        )
      );

      const title = await screen.findByText(/User not found/i);

      expect(title).toBeInTheDocument();
    });
  });
});
