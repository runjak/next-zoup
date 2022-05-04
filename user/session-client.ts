import { isObject, isString } from "lodash";

/**
 * Client specific parts of session handling.
 * For details on server-side session handling see session.ts
 */

export type SessionHandle = { sessionIdentifier: string };

export const isSessionHandle = (
  maybeSessionHandle: unknown
): maybeSessionHandle is SessionHandle => {
  if (isObject(maybeSessionHandle)) {
    const { sessionIdentifier } = maybeSessionHandle as Record<string, unknown>;

    return isString(sessionIdentifier);
  }

  return false;
};
