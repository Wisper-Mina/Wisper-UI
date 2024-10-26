/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/types/state";
import { setImage, setPublicKey } from "@/redux/slices/session/slice";
import {
  deletePublicKeyCookie,
  setPublicKeyCookie,
} from "@/redux/slices/session/thunk";
import { ImageType } from "@/types/messages";
import { initSocket } from "@/redux/slices/socket/slice";
import {
  getNewMessage,
  setReceiverOnline,
  setReceiverTyping,
} from "@/redux/slices/chat/slice";

export const SessionProvider = ({
  children,
  publicKey,
}: Readonly<{ children: React.ReactNode; publicKey?: string }>) => {
  const dispatch = useAppDispatch();

  const { chats } = useAppSelector((state) => state.chat);

  const router = useRouter();

  const publicKey58 = useAppSelector((state) => state.session.publicKeyBase58);

  const socket = useAppSelector((state) => state.socket.socket);

  useEffect(() => {
    if (!publicKey58) {
      return;
    }
    dispatch(initSocket());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey58]);

  useEffect(() => {
    if (!socket || !publicKey58) {
      return;
    }
    const chatIds = chats.map((chat) => chat.id);
    socket.emit("join app", publicKey58, chatIds);
  }, [chats, publicKey58, socket]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket?.on("online users", (users: string[]) => {
      users.forEach((user: string) => {
        dispatch(setReceiverOnline({ chatWith: user, isOnline: true }));
      });
    });

    socket?.on("user online", (onlinePk: string) => {
      dispatch(setReceiverOnline({ chatWith: onlinePk, isOnline: true }));
    });

    socket?.on("user offline", (offlinePk: string) => {
      dispatch(setReceiverOnline({ chatWith: offlinePk, isOnline: false }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket?.on("user typing", (receiver58: string) => {
      dispatch(
        setReceiverTyping({
          chatWith: receiver58,
          isTyping: true,
        })
      );
    });
    socket?.on("user stopped typing", (receiver58: string) => {
      dispatch(
        setReceiverTyping({
          chatWith: receiver58,
          isTyping: false,
        })
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

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
    if (!socket) {
      return;
    }
    socket?.on("receive message", (data: any) => {
      if (data?.receiverPk === publicKey58) {
        dispatch(
          getNewMessage({ chatWith: data?.senderPk, newMessage: data.message })
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, publicKey58]);

  useEffect(() => {
    if (publicKey) {
      dispatch(setPublicKey(publicKey));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  useEffect(() => {
    const user_image = localStorage.getItem("user_image");
    if (user_image) {
      dispatch(setImage(user_image as ImageType));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};
