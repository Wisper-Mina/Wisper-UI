import { useEffect, useState } from "react";

import { setChat } from "@/redux/slices/chat/slice";
import { ChatType } from "@/types/messages";
import { useAppDispatch, useAppSelector } from "@/types/state";

export const useGetChat = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const pubkey = useAppSelector((state) => state.session.publicKeyBase58);

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
