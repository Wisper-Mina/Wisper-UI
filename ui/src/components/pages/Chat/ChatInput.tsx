import React, { useState } from "react";

import { useTheme } from "next-themes";

import { UpIcon } from "@/assets/svg/UpIcon";
import { useAppDispatch, useAppSelector } from "@/types/state";
import { setNewMessage } from "@/redux/slices/chat/slice";
import {
  sendMessageSocket,
  userStopTyping,
  userTyping,
} from "@/redux/slices/socket/slice";

export const ChatInput = ({
  chatWith,
  chat_id,
}: {
  chatWith: string | null;
  chat_id: string;
}) => {
  const [message, setMessage] = useState<string>("");

  const typerPk = useAppSelector((state) => state.session.publicKeyBase58);

  const dispatch = useAppDispatch();

  const { theme } = useTheme();

  if (!chatWith) {
    return null;
  }

  const sendMessage = () => {
    if (!message) return;
    dispatch(setNewMessage({ chatWith, newMessage: message }));
    dispatch(
      sendMessageSocket({
        senderPk: typerPk ?? "",
        chatId: chat_id,
        message: message,
        receiver58: chatWith,
      })
    );
    setMessage("");
    dispatch(
      userStopTyping({
        chat_id: chat_id,
        stopperPk: typerPk ?? "",
      })
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
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
            if (!!e.target.value) {
              dispatch(
                userTyping({ typerPk: typerPk ?? "", chat_id: chat_id })
              );
            } else {
              dispatch(
                userStopTyping({
                  chat_id: chat_id,
                  stopperPk: typerPk ?? "",
                })
              );
            }
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
