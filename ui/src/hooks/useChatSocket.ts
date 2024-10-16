import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/types/state";

import { io } from "socket.io-client";
import {
  getNewMessage,
  setReceiverOnline,
  setReceiverTyping,
} from "@/redux/slices/chat/slice";

export const useChatSocket = (chatId: string, receiver58: string) => {
  const pubkey = useAppSelector((state) => state.session.publicKeyBase58);

  const dispatch = useAppDispatch();

  const socket = io(process.env.NEXT_PUBLIC_SERVER_URL as string);
  useEffect(() => {
    if (!pubkey) {
      return;
    }
    socket.emit("join chat", chatId, pubkey);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubkey]);

  socket.on("join error", (data: any) => {
    console.log(data);
  });

  socket.on("online users", (users: string[]) => {
    if (users.includes(receiver58)) {
      dispatch(
        setReceiverOnline({
          chatWith: receiver58,
          isOnline: true,
        })
      );
    }
  });

  socket.on("user online", () => {
    dispatch(
      setReceiverOnline({
        chatWith: receiver58,
        isOnline: true,
      })
    );
  });

  socket.on("user offline", () => {
    dispatch(
      setReceiverOnline({
        chatWith: receiver58,
        isOnline: false,
      })
    );
  });

  const userTyping = (isTyping: boolean) => {
    if (isTyping) {
      socket.emit("typing", chatId, pubkey);
    } else {
      socket.emit("stop typing", chatId);
    }
  };

  const sendMessageToSocket = (message: string) => {
    socket.emit("send message", {
      chatId,
      message,
      receiverPk: receiver58,
    });
  };

  socket.on("receive chat", (data: any) => {
    console.log(data);
  });

  socket.on("user typing", (pubkey) => {
    dispatch(
      setReceiverTyping({
        chatWith: receiver58,
        isTyping: pubkey === receiver58,
      })
    );
  });

  socket.on("receive message", (data) => {
    if (data?.receiverPk === pubkey) {
      dispatch(
        getNewMessage({ chatWith: receiver58, newMessage: data.message })
      );
    }
  });

  socket.on("user stopped typing", () => {
    dispatch(
      setReceiverTyping({
        chatWith: receiver58,
        isTyping: false,
      })
    );
  });

  return { userTyping, sendMessageToSocket };
};
