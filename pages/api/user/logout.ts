import { NextApiRequest, NextApiResponse } from "next";
import {
  parseSessionIdentifier,
  sessionCookieName,
} from "../../../user/cookie";
import { expireSession } from "../../../user/session";

export type LogoutResponse = { message: string } | { error: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<LogoutResponse>
) {
  if (request.method !== "DELETE") {
    return response
      .status(400)
      .json({ error: "request must use 'DELETE' method." });
  }

  const maybeSession = parseSessionIdentifier(request.headers.cookie ?? "");
  if (maybeSession) {
    expireSession(maybeSession);
  }

  return response
    .status(200)
    .setHeader(
      "set-cookie",
      `${sessionCookieName}=invalid; expires=${new Date(0).toUTCString()}`
    )
    .json({ message: "session invalidated." });
}
