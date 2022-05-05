import { createContext, Dispatch, useContext, useReducer } from "react";
import { SessionHandle } from "../user/session-client";

export type SessionAction =
  | { type: "login"; sessionHandle: SessionHandle }
  | { type: "logout" };

export type SessionState = {
  sessionHandle: SessionHandle | null;
};

const sessionReducer = (
  state: SessionState,
  action: SessionAction
): SessionState => {
  switch (action.type) {
    case "login":
      return { ...state, sessionHandle: action.sessionHandle };
    case "logout":
      return { ...state, sessionHandle: null };
    default:
      throw new Error("Unexpected action.type in sessionReducer");
  }
};

const initialSession: SessionState = { sessionHandle: null };

export const useSession = (): [SessionState, Dispatch<SessionAction>] =>
  useReducer(sessionReducer, initialSession);

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
