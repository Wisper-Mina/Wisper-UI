import { v4 as uuidv4 } from "uuid";

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { ChatResponse, ImageType } from "@/types/messages";
import { getCurrentTime } from "@/utils/dateConverter";

const initialState: ChatResponse = {
  chats: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChat: (state, action: PayloadAction<ChatResponse>) => {
      state.chats = action.payload.chats;
    },
    setUsername: (
      state,
      action: PayloadAction<{
        chatWith: string;
        username: string;
      }>
    ) => {
      const { chatWith, username } = action.payload;
      const chat = state.chats.find((chat) => chat.chatWith === chatWith);
      if (chat) {
        chat.username = username;
      }
    },
    setImage: (
      state,
      action: PayloadAction<{
        chatWith: string;
        image: ImageType;
      }>
    ) => {
      const { chatWith, image } = action.payload;
      const chat = state.chats.find((chat) => chat.chatWith === chatWith);
      if (chat) {
        chat.image = image;
      }
    },
    setNewMessage: (
      state,
      action: PayloadAction<{
        chatWith: string;
        newMessage: string;
      }>
    ) => {
      const { chatWith, newMessage } = action.payload;
      const chat = state.chats.find((chat) => chat.chatWith === chatWith);
      if (chat) {
        const id = chat.messages.length + 1;
        const { timeStr, timestamp } = getCurrentTime();
        const message = {
          content: newMessage,
          isMine: false,
          time: timeStr,
          timestamp,
          id: uuidv4(),
        };
        chat?.messages.push(message);
        chat.lastMessage = message;
      }
    },
  },
});

export const { setChat, setUsername, setImage, setNewMessage } =
  chatSlice.actions;

export default chatSlice.reducer;
