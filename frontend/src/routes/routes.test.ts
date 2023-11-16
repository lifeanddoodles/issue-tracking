import { USERS_BASE_API_URL, getPostOptions } from ".";
import { baseUrl, fakeUsers, newFakeUser } from "../__mocks__";

const fakeUser = fakeUsers[0];

describe("User routes", () => {
  test("fetches users", async () => {
    const response = await fetch(`${baseUrl}${USERS_BASE_API_URL}`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(fakeUsers);
  });

  test("given an ID, fetches user info", async () => {
    const userId = fakeUser._id;
    const response = await fetch(`${baseUrl}${USERS_BASE_API_URL}/${userId}`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(fakeUser);
  });

  test("adds new user", async () => {
    const options = getPostOptions(newFakeUser);
    const response = await fetch(`${baseUrl}${USERS_BASE_API_URL}`, options);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json).toEqual(newFakeUser);
  });
});
