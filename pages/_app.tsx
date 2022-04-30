import "../styles/normalize.min.css";
import "../styles/zoup.css";
import "../styles/forms.css";
import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
