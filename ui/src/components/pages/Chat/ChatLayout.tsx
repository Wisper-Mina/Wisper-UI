"use client";

import { useGetChat } from "@/hooks/useGetChat";
import { usePageWidth } from "@/hooks/usePageWidth";
import DesktopView from "./DesktopView";

export const ChatLayout = () => {
  const pageWidth = usePageWidth();

  const { loading, chat } = useGetChat();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!chat || chat?.chats.length === 0) {
    return <div>Chat not found</div>;
  }

  if (pageWidth > 700) {
    return <DesktopView chat={chat} />;
  }
  return <div>ChatLayout</div>;
};
