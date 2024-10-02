export interface ChatResponse {
  chats: ChatType[];
}

export interface ChatType {
  chatWith: string; // Public key base 58 of the chat partner
  username: string | null; // Username of the chat partner
  image: ImageType; // Image of the chat partner
  unReadMessages: number; // Number of unread messages
  messages: Message[];
}

export interface MessageType {
  id: string;
  content: string;
  timestamp: number;
  isMine: boolean;
}

export type ImageType =
  | "user1"
  | "user2"
  | "user3"
  | "user4"
  | "user5"
  | "user6"
  | "default";
