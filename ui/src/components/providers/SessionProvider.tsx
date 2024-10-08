/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAppDispatch } from "@/types/state";
import { setPublicKey } from "@/redux/slices/session/slice";
import {
  deletePublicKeyCookie,
  setPublicKeyCookie,
} from "@/redux/slices/session/thunk";

export const SessionProvider = ({
  children,
  publicKey,
}: Readonly<{ children: React.ReactNode; publicKey?: string }>) => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  useEffect(() => {
    const mina = (window as any).mina;

    if (mina == null) {
      return;
    }
    mina?.on("accountsChanged", (accounts: string[]) => {
      if (accounts?.length === 0) {
        dispatch(deletePublicKeyCookie());
        router.push("/home");
      } else {
        const publicKey = accounts[0];
        dispatch(
          setPublicKeyCookie({
            publicKeyBase58: publicKey,
          })
        ).then((res: any) => {
          if (!res?.error) {
            router.push("/chat");
          }
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (publicKey) {
      dispatch(setPublicKey(publicKey));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);
  return <>{children}</>;
};
