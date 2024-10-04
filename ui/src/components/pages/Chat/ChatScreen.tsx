"use client";

import { useAppSelector } from "@/types/state";
import ChatDesktop from "./DesktopView/ChatDesktop";
import { usePageWidth } from "@/hooks/usePageWidth";
import ChatMobile from "./MobileView/ChatMobile";

export const ChatScreen = ({ chat_id }: { chat_id: string }) => {
  const chat = useAppSelector((state) =>
    state.chat?.chats.find((c) => c.id === chat_id)
  );

  const pageWidth = usePageWidth();

  if (!chat) {
    return <div>Chat not found</div>;
  }

  if (pageWidth < 700) {
    return <ChatMobile chat={chat} />;
  }

  return <ChatDesktop chat={chat} />;
};
