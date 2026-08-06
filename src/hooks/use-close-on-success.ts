import { useEffect, useRef } from "react";

export function useCloseOnSuccess(
  isPending: boolean,
  hasError: boolean,
  onSuccess: () => void
) {
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending && !hasError) {
      onSuccess();
    }
    wasPending.current = isPending;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, hasError]);
}
