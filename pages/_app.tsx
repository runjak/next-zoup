import "../styles/normalize.min.css";
import "../styles/zoup.css";
import "../styles/forms.css";
import type { AppProps } from "next/app";
import {
  SessionDispatchProvider,
  SessionStateProvider,
  useSession,
} from "../hooks/useSession";

function App({ Component, pageProps }: AppProps) {
  const [sessionState, sessionDispatch] = useSession();

  return (
    <SessionDispatchProvider value={sessionDispatch}>
      <SessionStateProvider value={sessionState}>
        <Component {...pageProps} />
      </SessionStateProvider>
    </SessionDispatchProvider>
  );
}

export default App;
