import React, { useEffect } from "react";

import { setPublicKey } from "@/redux/slices/zkApp/slice";
import { useAppDispatch } from "@/types/state";

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
