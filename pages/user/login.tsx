import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import Layout from "../../components/Layout";
import { useSessionDispatch } from "../../hooks/useSession";
import { isSessionHandle } from "../../user/session-client";
import { LoginData } from "../api/user/login";

type LoginStatus = "idle" | "fetching" | "loggedIn" | "error";

const useLogin = () => {
  const [status, setStatus] = useState<LoginStatus>("idle");
  const sessionDispatch = useSessionDispatch();
  const router = useRouter();

  const doLogin = useCallback((loginData: LoginData) => {
    setStatus("fetching");
    fetch("/api/user/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    })
      .then(async (response) => {
        const maybeSessionHandle = await response.json();

        if (isSessionHandle(maybeSessionHandle)) {
          setStatus("loggedIn");
          sessionDispatch({ type: "login", sessionHandle: maybeSessionHandle });
          router.push("/user/logout");
        } else {
          setStatus("error");
        }
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  return { status, doLogin };
};

const Login: NextPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { status, doLogin } = useLogin();

  return (
    <Layout headline="Login">
      <form>
        <fieldset>
          <input
            type="username"
            id="username"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </fieldset>
        <fieldset>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </fieldset>
        <fieldset>
          <button
            type="submit"
            disabled={status === "fetching"}
            onClick={(event) => {
              event.preventDefault();
              doLogin({ username, password });
            }}
          >
            Login
          </button>
          <Link href="/user/registration">Register instead</Link>
        </fieldset>
      </form>
    </Layout>
  );
};

export default Login;
