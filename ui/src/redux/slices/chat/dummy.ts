import { ChatResponse } from "@/types/messages";

export const dummyChat: ChatResponse = {
  chats: [
    {
      id: "1",
      chatWith: "B62qk4moHsecw1ScLPycLUXqBaxvDRy3LZ6K8kQdC9WrNZEk5Q7tqRw",
      image: "user1",
      unReadMessages: 2,
      username: "John Doe",
      lastMessage: {
        timestamp: 1633660800000,
        id: "1",
        content: "Hello",
        time: "12:00",
        isMine: false,
      },
      messages: [
        {
          id: "1",
          timestamp: 1633660800000,
          time: "12:00",
          content: "Hi guys,what should we built at the hackathon?",
          isMine: false,
        },
        {
          id: "2",
          time: "12:01",
          timestamp: 1633660800000,
          content: "Hi guys,what should we built at the hackathon?",
          isMine: false,
        },
        {
          id: "3",
          time: "12:01",
          timestamp: 1633660800000,
          content:
            "I have an idea! How about a blockchain-based voting system?",
          isMine: false,
        },
        {
          id: "4",
          time: "12:01",
          timestamp: 1633660800000,
          content: "how would it work?",
          isMine: false,
        },
        {
          id: "5",
          time: "12:01",
          timestamp: 1633660800000,
          content: "I'll handle the frontend",
          isMine: true,
        },
        {
          id: "6",
          time: "12:01",
          timestamp: 1633660800000,
          content: "Who wants to handle the frontend design?",
          isMine: false,
        },
        {
          id: "7",
          time: "12:01",
          timestamp: 1633660800000,
          content: "I'll handle, the backend",
          isMine: true,
        },
        {
          id: "8",
          time: "12:01",
          timestamp: 1633660800000,
          content: "how would it work?",
          isMine: false,
        },
        {
          id: "51",
          time: "12:01",
          timestamp: 1633660800000,
          content: "I'll handle the frontend",
          isMine: true,
        },
        {
          id: "62",
          time: "12:01",
          timestamp: 1633660800000,
          content: "Who wants to handle the frontend design?",
          isMine: false,
        },
        {
          id: "17",
          time: "12:01",
          timestamp: 1633660800000,
          content: "I'll handle, the backend",
          isMine: true,
        },
        {
          id: "18",
          time: "12:01",
          timestamp: 1633660800000,
          content: "how would it work?",
          isMine: false,
        },
      ],
    },
    {
      id: "2",
      chatWith: "B62qk4moHsecw1ScLPycLUXqBaxvDRy3LZ6K8kQdC9WrNZEk5Q7tqRw",
      image: "user2",
      unReadMessages: 0,
      username: null,
      lastMessage: {
        timestamp: 1633660800000,
        id: "1",
        content: "Hello",
        time: "12:00",
        isMine: false,
      },
      messages: [
        {
          timestamp: 1633660800000,
          id: "1",
          content: "Hello",
          time: "12:00",
          isMine: false,
        },
      ],
    },
  ],
};