import { useEffect, useState } from "react";

const initialState = {
  data: null,
  error: null,
  loading: true,
};

export function useAsyncValue(loader, dependencies) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    let cancelled = false;
    setState(initialState);

    loader()
      .then((data) => {
        if (!cancelled) {
          setState({ data, error: null, loading: false });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState({ data: null, error, loading: false });
        }
      });

    return () => {
      cancelled = true;
    };
  }, dependencies);

  return state;
}
