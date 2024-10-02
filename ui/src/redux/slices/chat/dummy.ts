import { ChatResponse } from "@/types/messages";

export const dummyChat: ChatResponse = {
  chats: [
    {
      id: "1",
      chatWith: "B62qk4moHsecw1ScLPycLUXqBaxvDRy3LZ6K8kQdC9WrNZEk5Q7tqRw",
      image: "default",
      unReadMessages: 0,
      username: null,
      lastMessage: {
        id: "1",
        content: "Hello",
        time: "12:00",
        isMine: false,
      },
      messages: [
        {
          id: "1",
          time: "12:00",
          content: "Hello",
          time: "12:00",
          isMine: true,
        },
      ],
    },
  ],
};
