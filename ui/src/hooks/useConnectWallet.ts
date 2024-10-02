import { PublicKey } from "o1js";

import ZkappWorkerClient from "@/lib/zkAppWorkerClient";
import { useAppDispatch, useAppSelector } from "@/types/state";
import { setPublicKeyCookie } from "@/redux/slices/zkApp/thunk";

export const useConnectWallet = () => {
  const publicKeyBase58 = useAppSelector(
    (state) => state.zkApp.publicKeyBase58
  );

  const dispatch = useAppDispatch();

  const handleConnectWallet = () => {
    (async () => {
      const zkappWorkerClient = new ZkappWorkerClient();
      const mina = (window as any).mina;

      if (mina == null) {
        return;
      }

      const valuePublicKeyBase58: string = (await mina.requestAccounts())[0];
      const publicKey = PublicKey.fromBase58(valuePublicKeyBase58);

      console.log(`Using key:${publicKey.toBase58()}`);

      dispatch(
        setPublicKeyCookie({
          publicKeyBase58: valuePublicKeyBase58,
        })
      );

      const res = await zkappWorkerClient.fetchAccount({
        publicKey: publicKey!,
      });

      const accountExists = res.error == null;

      console.log(accountExists);
    })();
  };

  return { publicKeyBase58, handleConnectWallet };
};
