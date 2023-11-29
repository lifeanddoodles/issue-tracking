import { act, render, renderHook, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Mock, describe, expect, vi } from "vitest";
import Register from ".";
import { baseUrl, newFakeUser } from "../../../__mocks__";
import AuthContext from "../../../context/AuthContext";
import useAuth from "../../../hooks/useAuth";
import { ErrorType } from "../../../interfaces";
import { USERS_BASE_API_URL, getPostOptions } from "../../../routes";
import { getFieldErrorMessage, getReadableInputName } from "../../../utils";

const newUserData = {
  firstName: newFakeUser.firstName,
  lastName: newFakeUser.lastName,
  email: newFakeUser.email,
  password: newFakeUser.password,
  confirmPassword: newFakeUser.password,
};

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

describe("Register", () => {
  let authUserReqMock: Mock;
  let mockUseAuth: ReturnType<typeof useAuth>;

  beforeEach(() => {
    authUserReqMock = vi.fn(async (url, options) => {
      const response = await fetch(`${baseUrl}${url}`, options);
      const json = await response.json();
      return { data: json, status: response.status };
    });

    const { result: resultUseAuth } = renderHook(() => useAuth());

    mockUseAuth = {
      ...resultUseAuth.current,
      authUserReq: authUserReqMock,
    };
  });

  test("renders correctly", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    const title = screen.getByText("Register");
    const firstName = screen.getByLabelText(
      RegExp(`^${getReadableInputName("firstName")}`, "i")
    );
    const lastName = screen.getByLabelText(
      RegExp(`^${getReadableInputName("lastName")}`, "i")
    );
    const company = screen.getByLabelText(
      RegExp(`^${getReadableInputName("company")}`, "i")
    );
    const position = screen.getByLabelText(
      RegExp(`^${getReadableInputName("position")}`, "i")
    );
    const email = screen.getByLabelText(
      RegExp(`^${getReadableInputName("email")}`, "i")
    );
    const password = screen.getByLabelText(
      RegExp(`^${getReadableInputName("password")}`, "i")
    );
    const confirmPassword = screen.getByLabelText(
      RegExp(`^${getReadableInputName("confirmPassword")}`, "i")
    );
    const submitButton = screen.getByRole("button");

    const elements = [
      title,
      firstName,
      lastName,
      email,
      company,
      position,
      password,
      confirmPassword,
      submitButton,
    ];

    for (const element of elements) {
      expect(element).toBeInTheDocument();
    }
  });

  test.each`
    id
    ${"firstName"}
    ${"lastName"}
    ${"email"}
    ${"password"}
    ${"confirmPassword"}
  `("shows required error when $id is empty", async ({ id }) => {
    user.setup();

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const label = getReadableInputName(id);
    const inputField = screen.getByLabelText(
      RegExp(`^${label}`, "i")
    ) as HTMLInputElement;

    act(() => {
      inputField.focus();
      inputField.blur();
    });

    const errorRequiredText = getFieldErrorMessage({
      id,
      type: ErrorType.REQUIRED,
    });
    const inputError = screen.getByText(RegExp(`^${errorRequiredText}`, "i"));

    expect(inputError).toBeInTheDocument();
  });

  test.each`
    id
    ${"firstName"}
    ${"lastName"}
  `(
    "shows minimum length error when $id value is too short",
    async ({ id }) => {
      user.setup();

      render(
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      );

      const label = getReadableInputName(id);
      const inputField = screen.getByLabelText(
        RegExp(label, "i")
      ) as HTMLInputElement;

      await user.type(inputField, "a");

      const errorMinLengthText = getFieldErrorMessage({
        id,
        type: ErrorType.MINLENGTH,
        options: { minLength: inputField.minLength },
      });
      const inputError = screen.getByText(RegExp(errorMinLengthText, "i"));

      expect(inputError).toBeInTheDocument();
    }
  );

  test("handles submit event", async () => {
    user.setup();

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockUseAuth}>
          <Register />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    const firstName = screen.getByLabelText(
      RegExp(`^${getReadableInputName("firstName")}`, "i")
    );
    const lastName = screen.getByLabelText(
      RegExp(`^${getReadableInputName("lastName")}`, "i")
    );
    const email = screen.getByLabelText(
      RegExp(`^${getReadableInputName("email")}`, "i")
    );
    const password = screen.getByLabelText(
      RegExp(`^${getReadableInputName("password")}`, "i")
    );
    const confirmPassword = screen.getByLabelText(
      RegExp(`^${getReadableInputName("confirmPassword")}`, "i")
    );
    const submitButton = screen.getByRole("button");

    await user.type(firstName, newUserData.firstName);
    await user.type(lastName, newUserData.lastName);
    await user.type(email, newUserData.email);
    await user.type(password, newUserData.password);
    await user.type(confirmPassword, newUserData.password);
    await user.click(submitButton);

    const options = getPostOptions(newUserData);

    expect(authUserReqMock).toHaveBeenCalled();
    expect(authUserReqMock).toHaveBeenCalledWith(USERS_BASE_API_URL, options);
  });

  test("given valid input, responds with success", async () => {
    user.setup();

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockUseAuth}>
          <Register />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    const firstName = screen.getByLabelText(
      RegExp(`^${getReadableInputName("firstName")}`, "i")
    );
    const lastName = screen.getByLabelText(
      RegExp(`^${getReadableInputName("lastName")}`, "i")
    );
    const email = screen.getByLabelText(
      RegExp(`^${getReadableInputName("email")}`, "i")
    );
    const password = screen.getByLabelText(
      RegExp(`^${getReadableInputName("password")}`, "i")
    );
    const confirmPassword = screen.getByLabelText(
      RegExp(`^${getReadableInputName("confirmPassword")}`, "i")
    );
    const submitButton = screen.getByRole("button");

    await user.type(firstName, newUserData.firstName);
    await user.type(lastName, newUserData.lastName);
    await user.type(email, newUserData.email);
    await user.type(password, newUserData.password);
    await user.type(confirmPassword, newUserData.password);
    await user.click(submitButton);

    const options = getPostOptions(newUserData);

    expect(mockUseAuth.authUserReq).toHaveBeenCalled();
    expect(mockUseAuth.authUserReq).toHaveBeenCalledWith(
      USERS_BASE_API_URL,
      options
    );
    expect(mockUseAuth.authUserReq).toHaveReturned();
    expect(mockUseAuth.authUserReq).toHaveReturnedWith({
      data: newUserData,
      status: 201,
    });
  });

  test("given invalid input, disables submit button", async () => {
    user.setup();

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockUseAuth}>
          <Register />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    const firstName = screen.getByLabelText(
      RegExp(`^${getReadableInputName("firstName")}`, "i")
    );
    const lastName = screen.getByLabelText(
      RegExp(`^${getReadableInputName("lastName")}`, "i")
    );
    const email = screen.getByLabelText(
      RegExp(`^${getReadableInputName("email")}`, "i")
    );
    const password = screen.getByLabelText(
      RegExp(`^${getReadableInputName("password")}`, "i")
    );
    const confirmPassword = screen.getByLabelText(
      RegExp(`^${getReadableInputName("confirmPassword")}`, "i")
    );
    const submitButton = screen.getByRole("button");

    await user.type(firstName, newUserData.firstName);
    await user.type(lastName, newUserData.lastName);
    await user.type(email, newUserData.email);
    await user.type(password, newUserData.password);
    await user.type(confirmPassword, "123456");

    expect(submitButton).toBeDisabled();
    expect(authUserReqMock).not.toHaveBeenCalled();
  });
});
