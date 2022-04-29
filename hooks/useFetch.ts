import { useCallback, useState } from "react";

type FetchStatus = "ready" | "fetching" | "done";

const useFetch = <T>(fetchFunction: () => Promise<T | null>) => {
  const [status, setStatus] = useState<FetchStatus>("ready");
  const [result, setResult] = useState<T | null>(null);

  const doFetch = useCallback(async () => {
    if (status === "fetching") return;

    try {
      setStatus("fetching");
      setResult(await fetchFunction());
    } finally {
      setStatus("done");
    }
  }, []);

  return { status, result, doFetch };
};

export default useFetch;
