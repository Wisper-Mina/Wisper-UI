import { ChatType } from "@/types/messages";
import { ChatsTop } from "./ChatsTop";
import { ChatComp } from "../ChatComp";

interface ChatsProps {
  chats: ChatType[];
}

export const Chats = ({ chats }: ChatsProps) => {
  return (
    <div className="col-span-5 py-5 bg-light-chats-bg rounded-[28px] overflow-hidden">
      <ChatsTop />
      <div className="flex flex-col overflow-auto mt-8 max-h-full">
        {chats.map((chat) => (
          <ChatComp
            key={chat.id}
            chat={{
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
    </div>
  );
};
