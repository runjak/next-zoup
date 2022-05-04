import { readFile, writeFile } from "fs/promises";
import { every, isObject, isString } from "lodash";
import path from "path";
import { v4 as uuidV4 } from "uuid";
import { User } from ".";
import { dataDirectory } from "../config";
import { SessionHandle } from "./session-client";

/**
 * This file aims to define handling of user sessions.
 * The idea is to have a store of valid user sessions.
 * On login or registration a session can be created for a User.
 * A session consists of an identifier used to test existence of a session
 * and deliver the Session data if the session exists.
 * The session store is initially read from disk and written on change.
 */

export type Session = {
  name: string; // name of the user a session is associated with
};

const isSession = (maybeSession: unknown): maybeSession is Session => {
  if (isObject(maybeSession)) {
    const { username } = maybeSession as Record<string, unknown>;

    return isString(username);
  }

  return false;
};

// The SessionStore holds sessions using the session identifier as key.
// Knowledge of the session identifier is enough to gain access to a session.
type SessionStore = Record<string, Session>;

const isSessionStore = (
  maybeSessionStore: unknown
): maybeSessionStore is SessionStore => {
  if (isObject(maybeSessionStore)) {
    return every(Object.values(maybeSessionStore), isSession);
  }

  return false;
};

const sessionFile = path.join(dataDirectory, "sessions.json");

const initSessions = async (): Promise<SessionStore> => {
  try {
    const data = await readFile(sessionFile);
    const maybeSessionStore = JSON.parse(String(data));

    if (isSessionStore(maybeSessionStore)) {
      return maybeSessionStore;
    }
  } catch {}

  return {};
};

const writeSessions = (store: SessionStore): Promise<SessionStore> =>
  writeFile(sessionFile, JSON.stringify(store, null, 2)).then(() => store);

let asyncStore: Promise<SessionStore> = initSessions();

export const getSession = (
  sessionIdentifier: string
): Promise<Session | null> =>
  asyncStore.then((store) => store[sessionIdentifier] ?? null);

const storeWithoutSession = async (
  sessionIdentifier: string
): Promise<SessionStore> => {
  const { [sessionIdentifier]: toDrop, ...nextStore } = await asyncStore;
  return nextStore;
};

export const expireSession = (sessionIdentifier: string) => {
  asyncStore = storeWithoutSession(sessionIdentifier).then(writeSessions);
};

const storeWithSession = async (
  sessionIdentifier: string,
  session: Session
): Promise<SessionStore> => {
  const store = await asyncStore;
  return { ...store, [sessionIdentifier]: session };
};

export const makeSession = (user: User): SessionHandle => {
  const sessionIdentifier = uuidV4();
  const session: Session = { name: user.author.name };

  asyncStore = storeWithSession(sessionIdentifier, session).then(writeSessions);

  return { sessionIdentifier };
};
