import React, { useEffect } from "react";

import { useAppDispatch } from "@/types/state";
import { setPublicKey } from "@/redux/slices/session/slice";

export const SessionProvider = ({
  children,
  publicKey,
}: Readonly<{ children: React.ReactNode; publicKey?: string }>) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (publicKey) {
      dispatch(setPublicKey(publicKey));
    }
  }, [publicKey]);
  return <>{children}</>;
};
