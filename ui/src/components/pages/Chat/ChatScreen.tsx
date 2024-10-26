"use client";

import { useAppDispatch, useAppSelector } from "@/types/state";
import ChatDesktop from "./DesktopView/ChatDesktop";
import { usePageWidth } from "@/hooks/usePageWidth";
import ChatMobile from "./MobileView/ChatMobile";
import { useEffect } from "react";
import { joinChat } from "@/redux/slices/chat/thunk";

export const ChatScreen = ({ chat_id }: { chat_id: string }) => {
  const chat = useAppSelector((state) =>
    state.chat?.chats.find((c) => c.id === chat_id)
  );

  const publicKey = useAppSelector((state) => state.session.publicKeyBase58);

  const socket = useAppSelector((state) => state.socket.socket);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!chat && publicKey) {
      dispatch(
        joinChat({
          chat_id,
          publicKey,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat, publicKey]);

  useEffect(() => {
    if (!socket || !publicKey || !chat_id) {
      return;
    }
    socket.emit("join chat", publicKey, chat_id);
  }, [publicKey, chat_id, socket]);

  const pageWidth = usePageWidth();

  if (!chat) {
    return null;
  }

  if (pageWidth <= 700) {
    return <ChatMobile chat={chat} />;
  }

  return <ChatDesktop chat={chat} />;
};
