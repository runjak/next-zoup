import { isObject } from "lodash";
import {
  createContext,
  Dispatch,
  useContext, useReducer
} from "react";
import { isSessionHandle, SessionHandle } from "../user/session-client";

export type SessionAction =
  | { type: "login"; sessionHandle: SessionHandle }
  | { type: "logout" }
  | { type: "loadFromLocalStorage" };

export type SessionState = {
  sessionHandle: SessionHandle | null;
};

const isSessionState = (
  maybeSessionState: unknown
): maybeSessionState is SessionState => {
  if (isObject(maybeSessionState)) {
    const { sessionHandle } = maybeSessionState as Record<string, unknown>;
    return isSessionHandle(sessionHandle);
  }
  return false;
};

const localStorageKey = "zoup-session-state";

const sessionReducer = (
  state: SessionState,
  action: SessionAction
): SessionState => {
  switch (action.type) {
    case "login":
      return { ...state, sessionHandle: action.sessionHandle };
    case "logout":
      return { ...state, sessionHandle: null };
    case "loadFromLocalStorage":
      try {
        const sessionState = JSON.parse(window.localStorage[localStorageKey]);
        if (isSessionState(sessionState)) {
          return sessionState;
        }
      } catch {}
      return state;
    default:
      throw new Error("Unexpected action.type in sessionReducer");
  }
};

const storedSessionReducer: typeof sessionReducer = (state, action) => {
  const nextState = sessionReducer(state, action);

  if (window.localStorage) {
    window.localStorage[localStorageKey] = JSON.stringify(nextState);
  }

  return nextState;
};

const initialSession: SessionState = { sessionHandle: null };

export const useSession = (): [SessionState, Dispatch<SessionAction>] =>
  useReducer(storedSessionReducer, initialSession);

const sessionStateContext = createContext<SessionState | null>(null);

export const useSessionState = (): SessionState => {
  const sessionState = useContext(sessionStateContext);

  if (!sessionState) {
    throw Error("useSessionState() called outside of a provider!");
  }

  return sessionState;
};

export const SessionStateProvider = sessionStateContext.Provider;

const sessionDispatchContext = createContext<Dispatch<SessionAction> | null>(
  null
);

export const useSessionDispatch = (): Dispatch<SessionAction> => {
  const sessionDispatch = useContext(sessionDispatchContext);

  if (!sessionDispatch) {
    throw new Error("useSessionDispatch() called outside of a provider!");
  }

  return sessionDispatch;
};

export const SessionDispatchProvider = sessionDispatchContext.Provider;
