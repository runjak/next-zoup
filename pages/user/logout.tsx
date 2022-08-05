import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import Layout from "../../components/Layout";
import { useSessionDispatch, useSessionState } from "../../hooks/useSession";

type LogoutStatus = "idle" | "fetching" | "loggedOut" | "error";

const useLogout = () => {
  const [status, setStatus] = useState<LogoutStatus>("idle");

  const sessionDispatch = useSessionDispatch();
  const router = useRouter();

  const doLogout = useCallback(() => {
    setStatus("fetching");
    fetch("/api/user/logout", { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          setStatus("loggedOut");
          sessionDispatch({ type: "logout" });
          router.push("/user/login");
        } else {
          setStatus("error");
        }
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  return { status, doLogout };
};

const Logout: NextPage = () => {
  const { status, doLogout } = useLogout();
  const sessionState = useSessionState();
  const loggedIn = sessionState.sessionHandle !== null;
  const username = sessionState.sessionHandle?.author.name ?? "";

  return (
    <Layout headline="Logout">
      <form>
        <fieldset>Currently logged in as '{username}'.</fieldset>
        <fieldset>
          <button
            type="submit"
            disabled={!loggedIn || status === "fetching"}
            onClick={doLogout}
          >
            Logout
          </button>
          <Link href="/user/delete">Delete user instead</Link>
        </fieldset>
      </form>
    </Layout>
  );
};

export default Logout;
