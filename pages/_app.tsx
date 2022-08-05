import type { AppProps } from "next/app";
import { useEffect } from "react";
import {
  SessionDispatchProvider,
  SessionStateProvider,
  useSession,
} from "../hooks/useSession";
import "../styles/forms.css";
import "../styles/normalize.min.css";
import "../styles/zoup.css";

function App({ Component, pageProps }: AppProps) {
  const [sessionState, sessionDispatch] = useSession();
  useEffect(() => {
    sessionDispatch({ type: "loadFromLocalStorage" });
  }, []);

  return (
    <SessionDispatchProvider value={sessionDispatch}>
      <SessionStateProvider value={sessionState}>
        <Component {...pageProps} />
      </SessionStateProvider>
    </SessionDispatchProvider>
  );
}

export default App;
