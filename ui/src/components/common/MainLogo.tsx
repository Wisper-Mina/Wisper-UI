"use client";
import { useTheme } from "next-themes";

import { MainLogoSvg } from "@/assets/svg/MainLogoSvg";

export const MainLogo = () => {
  const { theme } = useTheme();

  return <MainLogoSvg theme={theme} />;
};
