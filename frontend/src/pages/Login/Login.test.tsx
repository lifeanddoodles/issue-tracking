import { act, render, renderHook, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Mock, describe, expect, vi } from "vitest";
import Login from ".";
import { baseUrl, fakeUsers } from "../../__mocks__";
import AuthContext from "../../context/AuthContext";
import useAuth from "../../hooks/useAuth";
import { ErrorType } from "../../interfaces";
import { AUTH_BASE_API_URL, getPostOptions } from "../../routes";
import { getFieldErrorMessage, getReadableInputName } from "../../utils";

const fakeUser = fakeUsers[0];
const userLoginData = {
  email: fakeUser.email,
  password: fakeUser.password,
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

describe("Login", () => {
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
        <Login />
      </MemoryRouter>
    );
    const title = screen.getByText("Login");
    const email = screen.getByLabelText(
      RegExp(`^${getReadableInputName("email")}`, "i")
    );
    const password = screen.getByLabelText(
      RegExp(`^${getReadableInputName("password")}`, "i")
    );
    const submitButton = screen.getByRole("button");

    const elements = [title, email, password, submitButton];

    for (const element of elements) {
      expect(element).toBeInTheDocument();
    }
  });

  test.each`
    id
    ${"email"}
    ${"password"}
  `("shows required error when $id is empty", async ({ id }) => {
    user.setup();

    render(
      <MemoryRouter>
        <Login />
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

  test("handles submit event", async () => {
    user.setup();

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockUseAuth}>
          <Login />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    const email = screen.getByLabelText(
      RegExp(`^${getReadableInputName("email")}`, "i")
    );
    const password = screen.getByLabelText(
      RegExp(`^${getReadableInputName("password")}`, "i")
    );
    const submitButton = screen.getByRole("button");

    await user.type(email, userLoginData.email);
    await user.type(password, userLoginData.password);
    await user.click(submitButton);
    const options = getPostOptions(userLoginData);

    expect(authUserReqMock).toHaveBeenCalled();
    expect(authUserReqMock).toHaveBeenCalledWith(
      `${AUTH_BASE_API_URL}/login`,
      options
    );
  });

  test("given valid input, responds with success", async () => {
    user.setup();

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockUseAuth}>
          <Login />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    const email = screen.getByLabelText(
      RegExp(`^${getReadableInputName("email")}`, "i")
    );
    const password = screen.getByLabelText(
      RegExp(`^${getReadableInputName("password")}`, "i")
    );
    const submitButton = screen.getByRole("button");

    await user.type(email, userLoginData.email);
    await user.type(password, userLoginData.password);
    await user.click(submitButton);

    const options = getPostOptions(userLoginData);

    expect(authUserReqMock).toHaveBeenCalled();
    expect(authUserReqMock).toHaveBeenCalledWith(
      `${AUTH_BASE_API_URL}/login`,
      options
    );
    expect(authUserReqMock).toHaveReturned();
    expect(authUserReqMock).toHaveReturnedWith({
      data: fakeUser,
      status: 200,
    });
  });

  test.each`
    emailValue        | passwordValue
    ${"invalidEmail"} | ${"123456"}
    ${"a@b.c"}        | ${"123456"}
  `(
    "given invalid input, disables submit button",
    async ({ emailValue, passwordValue }) => {
      user.setup();

      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockUseAuth}>
            <Login />
          </AuthContext.Provider>
        </MemoryRouter>
      );

      const email = screen.getByLabelText(
        RegExp(`^${getReadableInputName("email")}`, "i")
      );
      const password = screen.getByLabelText(
        RegExp(`^${getReadableInputName("password")}`, "i")
      );
      const submitButton = screen.getByRole("button");

      await user.type(email, emailValue);
      await user.type(password, passwordValue);

      expect(submitButton).toBeDisabled();
      expect(authUserReqMock).not.toHaveBeenCalled();
    }
  );

  test("given wrong credentials, responds with error", async () => {
    user.setup();

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockUseAuth}>
          <Login />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    const email = screen.getByLabelText(
      RegExp(`^${getReadableInputName("email")}`, "i")
    );
    const password = screen.getByLabelText(
      RegExp(`^${getReadableInputName("password")}`, "i")
    );
    const submitButton = screen.getByRole("button");

    await user.type(email, userLoginData.email);
    await user.type(password, "123456");
    await user.click(submitButton);

    const options = getPostOptions({
      email: userLoginData.email,
      password: "123456",
    });

    expect(authUserReqMock).toHaveBeenCalled();
    expect(authUserReqMock).toHaveBeenCalledWith(
      `${AUTH_BASE_API_URL}/login`,
      options
    );
    expect(authUserReqMock).toHaveReturned();
    expect(authUserReqMock).toHaveReturnedWith({
      data: { message: "Authentication failed" },
      status: 401,
    });
  });
});
