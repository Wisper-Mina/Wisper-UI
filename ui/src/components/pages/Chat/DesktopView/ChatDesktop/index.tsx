import { ChatType } from "@/types/messages";
import { Top } from "./Top";
import { Messages } from "./Messages";
import { ChatInput } from "./ChatInput";
import { useState } from "react";
import { SettingScreen } from "./SettingScreen";

const ChatDesktop = ({ chat }: { chat: ChatType }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  return (
    <div className="col-span-11 bg-light-chats-bg dark:bg-dark-chats-bg overflow-hidden h-full rounded-[28px] relative">
      {!isSettingsOpen && (
        <>
          <Top
            id={chat?.id}
            chatWith={chat?.chatWith}
            username={chat?.username}
            image={chat?.image}
            isSettingsOpen={isSettingsOpen}
            setIsSettingsOpen={setIsSettingsOpen}
          />
          <Messages messages={chat?.messages} />
          <ChatInput />
        </>
      )}
      {isSettingsOpen && (
        <SettingScreen
          setIsSettingsOpen={setIsSettingsOpen}
          image={chat?.image}
          username={chat?.username}
          chatWith={chat?.chatWith}
        />
      )}
    </div>
  );
};

export default ChatDesktop;
