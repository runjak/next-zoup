import { isObject } from "lodash";
import { isAuthor, NamedAuthor } from "../feed";

/**
 * Client specific parts of session handling.
 * For details on server-side session handling see session.ts
 */

export type SessionHandle = { author: NamedAuthor };

export const isSessionHandle = (
  maybeSessionHandle: unknown
): maybeSessionHandle is SessionHandle => {
  if (isObject(maybeSessionHandle)) {
    const { author } = maybeSessionHandle as Record<string, unknown>;

    return isAuthor(author) && author.name !== undefined;
  }

  return false;
};
