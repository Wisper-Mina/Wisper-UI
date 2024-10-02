"use client";

import { useAppSelector } from "@/types/state";
import ChatDesktop from "./DesktopView/ChatDesktop";

export const ChatScreen = ({ chat_id }: { chat_id: string }) => {
  const chat = useAppSelector((state) =>
    state.chat?.chats.find((c) => c.id === chat_id)
  );

  if (!chat) {
    return <div>Chat not found</div>;
  }

  return <ChatDesktop chat={chat} />;
};
