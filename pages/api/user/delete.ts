import { isObject, isString } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { deleteUser, readUser, verify } from "../../../user";
import {
  parseSessionIdentifier,
  sessionCookieName,
} from "../../../user/cookie";
import { expireSession, getSession } from "../../../user/session";
import { LogoutResponse } from "./logout";

export type DeletionData = { password: string };

const isDeletionData = (
  maybeDeletionData: unknown
): maybeDeletionData is DeletionData => {
  if (isObject(maybeDeletionData)) {
    const { password } = maybeDeletionData as Record<string, unknown>;
    return isString(password);
  }

  return false;
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<LogoutResponse>
) {
  if (request.method !== "DELETE") {
    return response
      .status(400)
      .json({ error: "request must use 'DELETE' method." });
  }

  const deletionData = JSON.parse(request.body);
  if (!isDeletionData(deletionData)) {
    return response
      .status(400)
      .json({ error: "request body must contain valid DeletionData." });
  }

  const sessionIdentifier = parseSessionIdentifier(
    request.headers.cookie ?? ""
  );
  if (sessionIdentifier) {
    const session = await getSession(sessionIdentifier);
    if (!session) {
      return response.status(401).json({ error: "invalid session." });
    }

    const user = await readUser(session.name);
    if (!user) {
      expireSession(sessionIdentifier);
      return response
        .status(200)
        .setHeader(
          "set-cookie",
          `${sessionCookieName}=invalid; expires=${new Date(0).toUTCString()}`
        )
        .json({ message: "invalid session." });
    }

    const passwordValid = await verify(deletionData.password, user);
    if (!passwordValid) {
      return response.status(400).json({ error: "invalid password." });
    }

    deleteUser(user);
    expireSession(sessionIdentifier);
  }

  return response
    .status(200)
    .setHeader(
      "set-cookie",
      `${sessionCookieName}=invalid; expires=${new Date(0).toUTCString()}`
    )
    .json({ message: "user deleted." });
}
