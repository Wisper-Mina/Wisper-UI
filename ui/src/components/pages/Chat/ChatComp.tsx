import Image from "next/image";

import { ChatType } from "@/types/messages";

interface ChatCompProps {
  chat: Omit<ChatType, "messages">;
}

export const ChatComp = ({ chat }: ChatCompProps) => {
  console.log(chat);
  return (
    <div className="p-4 flex font-sora items-center gap-x-3">
      <Image
        alt="user"
        src={`/users/${chat.image}.svg`}
        width={48}
        height={48}
      />
      <div className="h-12 flex-1 py-1 flex flex-col justify-between">
        <p className="font-semibold text-light-chats-text text-base">
          {chat.username
            ? chat.username
            : chat?.chatWith?.slice(0, 12) + "..." + chat?.chatWith?.slice(-6)}
        </p>
        <p className="truncate font-semibold max-w-[250px] text-opacity-60 text-light-chats-text text-xs">
          {chat.lastMessage?.content}
        </p>
      </div>
      <div className="h-12 py-1 flex flex-col justify-between">
        <p className="font-medium text-opacity-60 text-light-chats-text text-[10px]">
          {chat.lastMessage?.time}
        </p>
        {chat?.unReadMessages > 0 && (
          <div className="min-w-4 min-h-4 flex items-center justify-center rounded-full bg-light-chats-unread">
            <span className="text-white text-[10px] font-medium">
              {chat.unReadMessages}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
