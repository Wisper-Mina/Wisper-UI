import { ChatType } from "@/types/messages";
import { Top } from "./Top";
import { Messages } from "./Messages";
import { ChatInput } from "./ChatInput";

const ChatDesktop = ({ chat }: { chat: ChatType }) => {
  return (
    <div className="col-span-11 bg-light-chats-bg overflow-hidden h-full rounded-[28px] relative">
      <Top
        id={chat?.id}
        chatWith={chat?.chatWith}
        username={chat?.username}
        image={chat?.image}
      />
      <Messages messages={chat?.messages} />
      <ChatInput />
    </div>
  );
};

export default ChatDesktop;
