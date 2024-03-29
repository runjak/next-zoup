import Head from "next/head";
import Link from "next/link";
import { CSSProperties, FC, ReactNode } from "react";
import { useSessionState } from "../hooks/useSession";

type LayoutProps = {
  headline: string;
  children: ReactNode;
};

const footerStyle: CSSProperties = {
  display: "flex",
  flex: "1 1",
  padding: "1rem 0",
  borderTop: "1px solid #666",
  justifyContent: "center",
  alignItems: "center",
};

const Layout: FC<LayoutProps> = ({ headline, children }) => {
  const isLoggedIn = useSessionState().sessionHandle !== null;

  return (
    <>
      <Head>
        <title>{headline}</title>
      </Head>
      <header>
        <h1>{headline}</h1>
      </header>
      <div id="nav-meta">
        {isLoggedIn ? (
          <Link href="/user/logout">
            <a title="logout">🔒</a>
          </Link>
        ) : (
          <Link href="/user/login">
            <a title="login">🔓</a>
          </Link>
        )}
      </div>
      <main>{children}</main>
      <footer style={footerStyle}>
        Powered by &nbsp;
        <a href="https://github.com/runjak/next-zoup">next-zoup</a>.
      </footer>
    </>
  );
};

export default Layout;
