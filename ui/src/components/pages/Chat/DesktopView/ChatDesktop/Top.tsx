import { useTheme } from "next-themes";
import Image from "next/image";

import { SettingsIcon } from "@/assets/svg/SettingsIcon";

interface TopProps {
  id: string;
  chatWith: string;
  username: string | null;
  image: string;
}
export const Top = ({ id, chatWith, username, image }: TopProps) => {
  const { theme } = useTheme();

  const handleSettings = () => {};

  return (
    <div className="bg-[#F0E8FF] dark:bg-[#151515] py-5 px-9">
      <div className="flex justify-between items-center">
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
        <button onClick={handleSettings} className="p-1">
          <SettingsIcon theme={theme} />
        </button>
      </div>
    </div>
  );
};
