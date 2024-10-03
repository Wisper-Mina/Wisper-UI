import { useTheme } from "next-themes";

import { RightArrowIcon } from "@/assets/svg/RightArrowIcon";

export const StartChat = () => {
  const { theme } = useTheme();

  const handleStartChat = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      onClick={handleStartChat}
      className="py-3 cursor-pointer hover:bg-primary transition-all font-sora rounded-full bg-secondary px-5 flex gap-x-4 items-center justify-between w-[335px]"
    >
      <div className="flex items-center gap-x-3">
        <p className="text-xl dark:text-black text-white">Start Chatting</p>
      </div>
      <div className="min-w-[46px] min-h-[46px] rounded-full flex items-center justify-center dark:bg-white bg-black">
        <RightArrowIcon theme={theme} />
      </div>
    </div>
  );
};
