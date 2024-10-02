import { ChatResponse } from "@/types/messages";

export const dummyChat: ChatResponse = {
  chats: [
    {
      chatWith: "B62qk4moHsecw1ScLPycLUXqBaxvDRy3LZ6K8kQdC9WrNZEk5Q7tqRw",
      image: "default",
      unReadMessages: 0,
      username: null,
      messages: [
        {
          id: "1",
          content: "Hello",
          timestamp: 1626180000000,
          isMine: true,
        },
      ],
    },
  ],
};
