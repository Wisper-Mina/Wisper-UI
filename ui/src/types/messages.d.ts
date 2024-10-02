export interface ChatResponse {
  chats: ChatType[];
}

export interface ChatType {
  id: string; // Chat id
  chatWith: string; // Public key base 58 of the chat partner
  username: string | null; // Username of the chat partner
  image: ImageType; // Image of the chat partner
  unReadMessages: number; // Number of unread messages
  lastMessage: MessageType; // Last message in the chat
  messages: MessageType[];
}

export interface MessageType {
  id: string;
  content: string;
  time: string;
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
