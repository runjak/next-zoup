import { isObject, isString } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { readUser, verify } from "../../../user";
import { makeSession } from "../../../user/session";
import { SessionHandle } from "../../../user/session-client";

export type LoginData = { username: string; password: string };

const isLoginData = (maybeLoginData: unknown): maybeLoginData is LoginData => {
  if (isObject(maybeLoginData)) {
    const { username, password } = maybeLoginData as Record<string, unknown>;

    return isString(username) && isString(password);
  }

  return false;
};

export type LoginResponse = SessionHandle | { error: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<LoginResponse>
) {
  if (request.method !== "POST") {
    return response
      .status(400)
      .json({ error: "request must use 'POST' method." });
  }

  const loginData = JSON.parse(request.body);
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

  const { sessionHandle, sessionIdentifier } = makeSession(user);
  return response
    .status(200)
    .setHeader(
      "set-cookie",
      `zoup-session=${sessionIdentifier}; Secure; HttpOnly`
    )
    .json(sessionHandle);
}
