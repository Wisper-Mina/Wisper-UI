import { useEffect, useState } from "react";

import { ChatType } from "@/types/messages";
import { ChatTop } from "../../ChatTop";
import MessageList from "../../MessageList";
import { ChatInput } from "../../ChatInput";
import { SettingScreen } from "../../SettingScreen";
import { useAppDispatch } from "@/types/state";
import { clearUnReadMessages } from "@/redux/slices/chat/slice";

const ChatDesktop = ({ chat }: { chat: ChatType }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!!chat?.chatWith) {
      dispatch(clearUnReadMessages({ chatWith: chat.chatWith }));
    }
  }, []);

  return (
    <div className="col-span-11 bg-light-chats-bg dark:bg-dark-chats-bg overflow-hidden h-full rounded-[28px] relative">
      {!isSettingsOpen && (
        <>
          <div className="bg-[#F0E8FF] dark:bg-[#151515] py-5 px-9">
            <ChatTop
              id={chat.id}
              chatWith={chat.chatWith}
              username={chat.username}
              image={chat.image}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              setIsSettingsOpen={setIsSettingsOpen}
            />
          </div>
          <MessageList messages={chat?.messages} />
          <ChatInput chatWith={chat?.chatWith} />
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
