import { useEffect, useState } from "react";

import { io } from "socket.io-client";

import { setChat } from "@/redux/slices/chat/slice";
import { ChatType } from "@/types/messages";
import { useAppDispatch, useAppSelector } from "@/types/state";

export const useGetChat = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const pubkey = useAppSelector((state) => state.session.publicKeyBase58);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SERVER_URL as string);

    if (!pubkey) {
      return;
    }
    socket.emit("join app", pubkey);
    socket.on("receive chat", (data: any) => {
      console.log(data);
    });
  }, [pubkey]);

  const chat = useAppSelector((state) => state.chat);

  const getChatFromLocalStorage = (): ChatType[] => {
    const chats = localStorage.getItem("chats");
    const storedChat = chats ? JSON.parse(chats) : [];

    return storedChat;
  };

  const getChatFromSocket = () => {
    const socketChat: ChatType[] = [];
    return socketChat;
  };

  const saveChatToRedux = () => {
    setLoading(true);
    try {
      const storedChat = getChatFromLocalStorage();

      const socketChat = getChatFromSocket();

      // TODO: check if the chat already exists in the stored chat

      // Merge the two chats
      const mergedChat = [...storedChat, ...socketChat];

      // Save the merged chat to the redux store
      dispatch(setChat({ chats: mergedChat }));
      // dispatch(setChat(dummyChat));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    saveChatToRedux();
  }, []);

  return {
    chat,
    loading,
  };
};
