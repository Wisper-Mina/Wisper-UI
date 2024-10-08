import { FC } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { BackIcon } from "@/assets/svg/BackIcon";
import { SettingsIcon } from "@/assets/svg/SettingsIcon";
import { useAppDispatch } from "@/types/state";
import { openModal } from "@/redux/slices/modal/slice";
import { ChatSettings } from "@/components/modals/ChatSettings";

interface ChatTopProps {
  id: string;
  chatWith: string | null;
  username: string | null;
  image: string;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (value: boolean) => void;
  setIsSettingsOpen: (value: boolean) => void;
}

export const ChatTop: FC<ChatTopProps> = ({
  id,
  chatWith,
  username,
  image,
  isDropdownOpen,
  setIsDropdownOpen,
  setIsSettingsOpen,
}) => {
  const { theme } = useTheme();

  const router = useRouter();

  const dispatch = useAppDispatch();

  const handleSettings = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    } else {
      setIsDropdownOpen(true);
      dispatch(
        openModal({
          modal: (
            <ChatSettings chat_id={id} setIsSettingsOpen={setIsSettingsOpen} />
          ),
        })
      );
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <button onClick={() => router.back()} className="pr-4 mobile:hidden">
          <BackIcon theme={theme} />
        </button>
        <div className="flex items-center gap-x-3">
          <Image
            alt="user"
            src={`/users/${image}.svg`}
            width={48}
            height={48}
          />
          <div
            className={`h-12 flex-1 py-1 flex flex-col ${
              username ? "justify-between " : "justify-center"
            }`}
          >
            {username && (
              <p className="font-semibold text-light-text-secondary dark:text-white text-base">
                {username}
              </p>
            )}
            <p
              className={` font-semibold  text-light-chats-text dark:text-white text-xs ${
                username ? "text-opacity-60" : ""
              }`}
            >
              {chatWith?.slice(0, 24) + "..." + chatWith?.slice(-12)}
            </p>
          </div>
        </div>
      </div>
      <button onClick={handleSettings} className="p-2">
        <SettingsIcon theme={theme} />
      </button>
    </div>
  );
};
