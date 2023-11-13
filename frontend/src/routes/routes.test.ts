import { USERS_BASE_API_URL } from ".";
import { baseUrl, fakeUsers } from "../__mocks__";

const fakeUser = fakeUsers[0];

test("fetches users", async () => {
  const response = await fetch(`${baseUrl}${USERS_BASE_API_URL}`);

  expect(response.status).toBe(200);
  expect(await response.json()).toEqual(fakeUsers);
});

test("fetches the user info", async () => {
  const userId = fakeUser._id;
  const response = await fetch(`${baseUrl}${USERS_BASE_API_URL}/${userId}`);

  expect(response.status).toBe(200);
  expect(await response.json()).toEqual(fakeUser);
});
