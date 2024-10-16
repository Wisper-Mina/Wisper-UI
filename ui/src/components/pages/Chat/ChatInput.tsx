import React, { useState } from "react";

import { useTheme } from "next-themes";

import { UpIcon } from "@/assets/svg/UpIcon";
import { useAppDispatch } from "@/types/state";
import { setNewMessage } from "@/redux/slices/chat/slice";

export const ChatInput = ({
  chatWith,
  userTyping,
  sendMessageToSocket,
}: {
  chatWith: string | null;
  userTyping: (isTyping: boolean) => void;
  sendMessageToSocket: (message: string) => void;
}) => {
  const [message, setMessage] = useState<string>("");

  const dispatch = useAppDispatch();

  const { theme } = useTheme();

  if (!chatWith) {
    return null;
  }

  const sendMessage = () => {
    if (!message) return;
    dispatch(setNewMessage({ chatWith, newMessage: message }));
    sendMessageToSocket(message);
    setMessage("");
    userTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Enter'ın varsayılan davranışını engelle (form submit gibi)
      sendMessage();
    }
  };

  return (
    <div className="absolute left-3 right-3 mobile:bottom-[18px] bottom-[48px] flex items-center gap-x-2">
      <label htmlFor="chat-input" className="w-full">
        <input
          id="chat-input"
          type="text"
          className="w-full border border-light-input-border bg-transparent dark:bg-[#151515] rounded-[44px] h-12 px-4 text-sm outline-none"
          placeholder="Type a message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            userTyping(!!e.target.value);
          }}
          onKeyDown={handleKeyDown}
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
