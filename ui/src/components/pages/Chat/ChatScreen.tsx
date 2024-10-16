"use client";

import { useAppDispatch, useAppSelector } from "@/types/state";
import ChatDesktop from "./DesktopView/ChatDesktop";
import { usePageWidth } from "@/hooks/usePageWidth";
import ChatMobile from "./MobileView/ChatMobile";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useEffect } from "react";
import { joinChat } from "@/redux/slices/chat/thunk";

export const ChatScreen = ({
  chat_id,
  receiverPublicKey,
}: {
  chat_id: string;
  receiverPublicKey: string;
}) => {
  const chat = useAppSelector((state) =>
    state.chat?.chats.find((c) => c.id === chat_id)
  );

  const publicKey = useAppSelector((state) => state.session.publicKeyBase58);

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

  const { userTyping, sendMessageToSocket } = useChatSocket(
    chat_id,
    receiverPublicKey
  );

  const pageWidth = usePageWidth();

  if (!chat) {
    return null;
  }

  if (pageWidth <= 700) {
    return <ChatMobile chat={chat} />;
  }

  return (
    <ChatDesktop
      userTyping={userTyping}
      sendMessageToSocket={sendMessageToSocket}
      chat={chat}
    />
  );
};
