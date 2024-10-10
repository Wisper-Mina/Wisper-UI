import { useTheme } from "next-themes";
import Image from "next/image";

import { FileIcon } from "@/assets/svg/FileIcon";
import { SettingsIcon } from "@/assets/svg/SettingsIcon";
import { ShareIcon } from "@/assets/svg/ShareIcon";
import TrashIcon from "@/assets/svg/trash.svg";
import { APP_URL } from "@/lib/constants";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/types/state";
import { closeOverlay } from "@/redux/slices/overlaySlice";

interface ChatSettingsProps {
  icon: React.ReactNode;
  text: string;
  isLast?: boolean;
  type?: "danger" | "primary";
  callback: () => void;
}

export const ChatSettings = ({
  chat_id,
  setIsSettingsOpen,
  setIsDropdownOpen,
}: {
  chat_id: string;
  setIsSettingsOpen: (value: boolean) => void;
  setIsDropdownOpen: (value: boolean) => void;
}) => {
  const { theme } = useTheme();

  const chat_link_url = `${APP_URL}/chats/${chat_id}`;

  const dispatch = useAppDispatch();

  const items: ChatSettingsProps[] = [
    {
      icon: <ShareIcon theme={theme} size={20} />,
      text: "Share Link",
      callback: () => {
        window.navigator.clipboard.writeText(chat_link_url);
        toast.success("Copied !", {
          position: "top-right",
          autoClose: 2000,
        });
      },
    },
    {
      text: "Recipient Settings",
      icon: <SettingsIcon theme={theme} />,
      callback: () => {
        setIsSettingsOpen(true);
      },
    },
    {
      text: "Chat Settlement",
      icon: <FileIcon theme={theme} />,
      callback: () => {
        //TODO: Implement chat settlement
      },
    },
    {
      text: "Delete Chat",
      icon: <Image src={TrashIcon} alt="trash" width={20} height={20} />,
      type: "danger",
      callback: () => {
        //TODO: Implement delete chat
      },
    },
  ];
  return (
    <div className="bg-white dark:bg-dark-bg rounded-[20px] flex flex-col absolute top-[72px] right-4 z-50">
      {items.map((item, index) => (
        <ChatSettingsItem
          key={index}
          isLast={items.length - 1 === index}
          callback={() => {
            item.callback();
            setIsDropdownOpen(false);
            dispatch(closeOverlay());
          }}
          icon={item.icon}
          text={item.text}
          type={item.type}
        />
      ))}
    </div>
  );
};

const ChatSettingsItem = ({
  icon,
  text,
  isLast,
  type,
  callback,
}: ChatSettingsProps) => {
  return (
    <button
      onClick={callback}
      className={`px-5 py-3 flex items-center gap-x-2 ${
        !isLast ? "border-b" : "border-0"
      } border-light-grey`}
    >
      {icon}
      <p
        className={`text-sm font-semibold ${
          type === "danger" ? "text-[#EA4343]" : "text-black dark:text-white"
        }`}
      >
        {text}
      </p>
    </button>
  );
};
