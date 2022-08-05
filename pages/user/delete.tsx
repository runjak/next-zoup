import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import Layout from "../../components/Layout";
import { useSessionDispatch, useSessionState } from "../../hooks/useSession";

type DeleteStatus = "idle" | "fetching" | "deleted" | "error";

const useDelete = () => {
  const [status, setStatus] = useState<DeleteStatus>("idle");
  const sessionDispatch = useSessionDispatch();
  const router = useRouter();

  const doDelete = useCallback((password: string) => {
    setStatus("fetching");
    fetch("/api/user/delete", {
      method: "DELETE",
      body: JSON.stringify({ password }),
    })
      .then((response) => {
        if (response.ok) {
          setStatus("deleted");
          sessionDispatch({ type: "logout" });
          router.push("/user/registration");
        } else {
          setStatus("error");
        }
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  return { status, doDelete };
};

const Delete: NextPage = () => {
  const username = useSessionState().sessionHandle?.author.name ?? "";
  const [password, setPassword] = useState<string>("");
  const { status, doDelete } = useDelete();

  return (
    <Layout headline="Delete user">
      <form>
        <fieldset>Currently logged in as '{username}'.</fieldset>
        <fieldset>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </fieldset>
        <fieldset>
          <button
            type="submit"
            disabled={status === "fetching"}
            onClick={() => doDelete(password)}
          >
            Delete user
          </button>
        </fieldset>
      </form>
    </Layout>
  );
};

export default Delete;
