"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { useMounted } from "@/hooks/useMounted";

const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const mounted = useMounted();

  if (!mounted) return null;
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      {children}
    </NextThemesProvider>
  );
};

export default MainProvider;
