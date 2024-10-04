import { useAppSelector } from "@/types/state";
import { ChatComp } from "../../ChatComp";

export const ChatList = () => {
  const { chats } = useAppSelector((state) => state.chat);
  return (
    <div className="flex flex-col overflow-auto mt-8 max-h-full">
      {chats.map((chat, index) => (
        <ChatComp
          key={chat.id}
          chat={{
            isSelected: false,
            isLastChat: index === chats.length - 1,
            id: chat.id,
            chatWith: chat.chatWith,
            username: chat.username,
            image: chat.image,
            unReadMessages: chat.unReadMessages,
            lastMessage: chat.lastMessage,
          }}
        />
      ))}
    </div>
  );
};
