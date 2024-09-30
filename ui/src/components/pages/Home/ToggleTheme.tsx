"use client";
import { useTheme } from "next-themes";

import { DarkIcon } from "@/assets/svg/DarkIcon";
import { LightIcon } from "@/assets/svg/LightIcon";

export const ToggleTheme = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button onClick={toggleTheme}>
      {theme === "dark" ? <DarkIcon /> : <LightIcon />}
    </button>
  );
};
