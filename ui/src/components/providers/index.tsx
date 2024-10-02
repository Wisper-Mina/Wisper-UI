"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";

import { useMounted } from "@/hooks/useMounted";
import { store } from "@/redux/store";

const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const mounted = useMounted();

  if (!mounted) return null;
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <Provider store={store}>{children}</Provider>
    </NextThemesProvider>
  );
};

export default MainProvider;
