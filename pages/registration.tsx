import { NextPage } from "next";
import Link from "next/link";
import { useCallback, useState } from "react";
import Layout from "../components/Layout";
import { useSessionDispatch } from "../hooks/useSession";
import { isSessionHandle } from "../user/session-client";
import { RegistrationData } from "./api/user/registration";

type RegistrationStatus = "idle" | "fetching" | "registered" | "error";

const useRegistration = () => {
  const [status, setStatus] = useState<RegistrationStatus>("idle");
  const sessionDispatch = useSessionDispatch();

  const doRegister = useCallback((registrationData: RegistrationData) => {
    setStatus("fetching");
    fetch("/api/user/registration", {
      method: "POST",
      body: JSON.stringify(registrationData),
    })
      .then(async (response) => {
        const maybeSessionHandle = await response.json();

        if (isSessionHandle(maybeSessionHandle)) {
          setStatus("registered");
          sessionDispatch({ type: "login", sessionHandle: maybeSessionHandle });
        } else {
          setStatus("error");
        }
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  return { status, doRegister };
};

const Registration: NextPage = () => {
  const [inviteToken, setInviteToken] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { status, doRegister } = useRegistration();

  return (
    <Layout headline="Registration">
      <form>
        <fieldset>
          <input
            type="inviteToken"
            id="inviteToken"
            name="inviteToken"
            placeholder="inviteToken"
            value={inviteToken}
            onChange={(event) => setInviteToken(event.target.value)}
          />
        </fieldset>
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
              doRegister({ username, password, inviteToken });
            }}
          >
            Register
          </button>
          <Link href='/login'>Login instead</Link>
        </fieldset>
      </form>
    </Layout>
  );
};

export default Registration;
