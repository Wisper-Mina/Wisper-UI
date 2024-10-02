import { MainLogo } from "@/components/common/MainLogo";
import { ChatResponse } from "@/types/messages";
import { FC } from "react";
import { Chats } from "./Chats";

interface DesktopViewProps {
  chat: ChatResponse;
  children: React.ReactNode;
}

const DesktopView: FC<DesktopViewProps> = ({ chat, children }) => {
  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="fixed top-[54px] left-[50px]">
        <MainLogo />
      </div>
      <div className="grid grid-cols-16 px-8 gap-x-8 pt-[100px] pb-[46px] h-full">
        <Chats chats={chat?.chats} />
        {children}
      </div>
    </div>
  );
};

export default DesktopView;
