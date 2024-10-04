import { useTheme } from "next-themes";

import { PlusSvg } from "@/assets/svg/PlusSvg";

export const StartChat = () => {
  const { theme } = useTheme();

  return (
    <button className="bg-secondary hover:bg-primary transition-all p-4 flex items-center gap-x-1 absolute bottom-9 right-4 rounded-2xl shadow-lg z-30">
      <PlusSvg theme={theme} />
      <p className="text-sm ">Start</p>
    </button>
  );
};
