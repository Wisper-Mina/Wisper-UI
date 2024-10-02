import { useTheme } from "next-themes";

import { PlusSvg } from "@/assets/svg/PlusSvg";

export const ChatsTop = () => {
  const { theme } = useTheme();

  const createChat = () => {};

  return (
    <div className="flex font-sora justify-between items-center px-3">
      <h3 className="font-semibold text-2xl">Messages</h3>
      <button
        onClick={createChat}
        className="bg-secondary flex items-center px-4 py-3 rounded-2xl shadow-lg hover:bg-primary transition-all"
      >
        <PlusSvg theme={theme} />
        <p className="text-sm font-medium">Start</p>
      </button>
    </div>
  );
};
