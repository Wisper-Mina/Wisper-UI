import { MessageType } from "@/types/messages";
import { MessageComp } from "./MessageComp";
import { useEffect, useState } from "react";

export const Messages = ({ messages }: { messages: MessageType[] }) => {
  const [showMessages, setShowMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    setShowMessages([...messages].reverse());
  }, [messages]);

  return (
    <div className="max-h-[calc(100%_-_180px)] h-[calc(100%_-_180px)] gap-y-1 px-6 overflow-auto flex flex-col-reverse font-sora">
      {showMessages?.map((message) => (
        <MessageComp key={message.id} message={message} />
      ))}
    </div>
  );
};
