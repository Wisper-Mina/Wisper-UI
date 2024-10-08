import { v4 as uuidv4 } from "uuid";

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { ChatResponse, ChatType, ImageType } from "@/types/messages";
import { getCurrentTime } from "@/utils/dateConverter";
import { createNewChat } from "./thunk";

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
        const { timeStr, timestamp } = getCurrentTime();
        const message = {
          content: newMessage,
          isMine: true,
          time: timeStr,
          timestamp,
          id: uuidv4(),
        };
        chat?.messages.push(message);
        chat.lastMessage = message;
      }
    },
    clearUnReadMessages: (
      state,
      action: PayloadAction<{
        chatWith: string;
      }>
    ) => {
      const { chatWith } = action.payload;
      const chat = state.chats.find((chat) => chat.chatWith === chatWith);
      if (chat) {
        chat.unReadMessages = 0;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createNewChat.fulfilled, (state, action) => {
      const newChat: ChatType = {
        id: action.payload.chat_id,
        chatWith: action.payload.receiverPublicKey,
        username: null,
        image: "default",
        unReadMessages: 0,
        lastMessage: null,
        messages: [],
      };
      state.chats.push(newChat);
    });
  },
});

export const {
  setChat,
  setUsername,
  setImage,
  setNewMessage,
  clearUnReadMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
