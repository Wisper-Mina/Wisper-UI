"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";

import { useMounted } from "@/hooks/useMounted";
import { store } from "@/redux/store";
import { SessionProvider } from "./SessionProvider";
import { Overlay } from "./Overlay";

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
        <SessionProvider publicKey={publicKey}>
          <Overlay />
          {children}
        </SessionProvider>
      </Provider>
    </NextThemesProvider>
  );
};

export default MainProvider;
