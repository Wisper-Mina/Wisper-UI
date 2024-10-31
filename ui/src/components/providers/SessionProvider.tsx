/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect } from "react";

import { useParams, useRouter } from "next/navigation";

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
  setUserPubKey,
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

  const params = useParams<{ chat_id: string }>();

  const terminateOfflineChat = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const offlineChats = chats.filter((chat) => !chat.receiperOnline);
    // TODO: terminate offline chats
  }, [chats]);

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
    return () => {
      socket.off("online users");
      socket.off("user online");
      socket.off("user offline");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      terminateOfflineChat();
      const message = "Sayfadan ayrılmak üzeresiniz!";
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats]);

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
      let unRead = false;
      if (!params || !params.chat_id || params.chat_id !== data?.chatId) {
        unRead = true;
      }
      if (data?.receiverPk === publicKey58) {
        dispatch(
          getNewMessage({
            chatWith: data?.senderPk,
            newMessage: data.message,
            unRead,
          })
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, publicKey58]);

  useEffect(() => {
    if (publicKey) {
      dispatch(setPublicKey(publicKey));
      dispatch(setUserPubKey(publicKey));
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
