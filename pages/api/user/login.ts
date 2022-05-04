import { isObject, isString } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { readUser, verify } from "../../../user";
import { makeSession } from "../../../user/session";

export type LoginData = { username: string; password: string };

const isLoginData = (maybeLoginData: unknown): maybeLoginData is LoginData => {
  if (isObject(maybeLoginData)) {
    const { username, password } = maybeLoginData as Record<string, unknown>;

    return isString(username) && isString(password);
  }

  return false;
};

type LoginResponse = { session: string } | { error: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<LoginResponse>
) {
  if (request.method !== "POST") {
    return response
      .status(400)
      .json({ error: "request must use 'POST' method." });
  }

  const loginData = request.body;
  if (!isLoginData(loginData)) {
    return response
      .status(400)
      .json({ error: "request body must contain 'username' and 'password'." });
  }

  const user = await readUser(loginData.username);
  const valid = await (user ? verify(loginData.password, user) : false);

  if (!user || !valid) {
    return response
      .status(401)
      .json({ error: "invalid username or password." });
  }

  return response.status(200).json({ session: makeSession(user) });
}
