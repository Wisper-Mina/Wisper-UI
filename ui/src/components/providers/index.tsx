"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";

import { useMounted } from "@/hooks/useMounted";
import { store } from "@/redux/store";
import { SessionProvider } from "./SessionProvider";

const MainProvider = ({
  children,
  publicKey,
}: {
  children: React.ReactNode;
  publicKey?: string;
}) => {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <Provider store={store}>
        <SessionProvider publicKey={publicKey}>{children}</SessionProvider>
      </Provider>
    </NextThemesProvider>
  );
};

export default MainProvider;
