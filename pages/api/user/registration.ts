import { isObject, isString } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { hashPassword, readUser, User, writeUser } from "../../../user";
import { useInviteKey } from "../../../user/invite";
import { makeSession } from "../../../user/session";
import { LoginResponse } from "./login";

export type RegistrationData = {
  username: string;
  password: string;
  inviteToken: string;
};

const isRegistrationData = (
  maybeRegistrationData: unknown
): maybeRegistrationData is RegistrationData => {
  if (isObject(maybeRegistrationData)) {
    const { username, password, inviteToken, avatar } =
      maybeRegistrationData as Record<string, unknown>;

    return isString(username) && isString(password) && isString(inviteToken);
  }

  return false;
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<LoginResponse>
) {
  if (request.method !== "POST") {
    return response
      .status(400)
      .json({ error: "request must use 'POST' method." });
  }

  const registrationData = JSON.parse(request.body);
  if (!isRegistrationData(registrationData)) {
    return response
      .status(400)
      .json({ error: "request body must contain valid RegistrationData." });
  }

  const existingUser = await readUser(registrationData.username);
  if (existingUser !== null) {
    return response
      .status(400)
      .json({ error: `user '${registrationData.username}' already exists.` });
  }

  const inviteSuccessful = await useInviteKey(registrationData.inviteToken);
  if (!inviteSuccessful) {
    return response.status(400).json({ error: "Invalid invite token." });
  }

  const hash = await hashPassword(registrationData.password);
  const user: User = { hash, author: { name: registrationData.username } };

  await writeUser(user);
  const { sessionHandle, sessionIdentifier } = makeSession(user);

  return response
    .status(200)
    .setHeader(
      "set-cookie",
      `zoup-session=${sessionIdentifier}; Secure; HttpOnly`
    )
    .json(sessionHandle);
}
