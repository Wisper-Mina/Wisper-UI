import React, { useState } from "react";

import { useTheme } from "next-themes";

import { UpIcon } from "@/assets/svg/UpIcon";

export const ChatInput = () => {
  const [message, setMessage] = useState<string>("");

  const { theme } = useTheme();

  const sendMessage = () => {};

  return (
    <div className="absolute left-3 right-3 bottom-[18px] flex items-center gap-x-2">
      <label htmlFor="" className="w-full">
        <input
          type="text"
          className="w-full border border-light-input-border bg-transparent dark:bg-[#151515] rounded-[44px] h-12 px-4 text-sm outline-none"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <button
        onClick={sendMessage}
        className={`min-w-10 min-h-10 transition-all flex items-center justify-center rounded-full ${
          !!message
            ? "bg-secondary cursor-pointer"
            : "bg-primary cursor-default"
        }`}
      >
        <UpIcon theme={theme} />
      </button>
    </div>
  );
};
