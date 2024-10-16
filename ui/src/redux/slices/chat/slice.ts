import { v4 as uuidv4 } from "uuid";

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { ChatResponse, ChatType, ImageType } from "@/types/messages";
import { getCurrentTime } from "@/utils/dateConverter";
import { createNewChat, joinChat } from "./thunk";

const initialState: ChatResponse = {
  chats: [],
};

const saveToLocalStorage = (chats: ChatType[]) => {
  const chatsToSave = chats.map((chat) => {
    return {
      ...chat,
      receiperOnline: false,
      receiperTyping: false,
    };
  });
  localStorage.setItem("chats", JSON.stringify(chatsToSave));
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
        saveToLocalStorage(state.chats);
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
        saveToLocalStorage(state.chats);
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
        saveToLocalStorage(state.chats);
      }
    },
    getNewMessage: (
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
          isMine: false,
          time: timeStr,
          timestamp,
          id: uuidv4(),
        };
        chat?.messages.push(message);
        chat.lastMessage = message;
        //TODO: add if user in chat page then don't increase unReadMessages
        chat.unReadMessages += 1;
        saveToLocalStorage(state.chats);
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
        saveToLocalStorage(state.chats);
      }
    },
    setReceiverOnline: (
      state,
      action: PayloadAction<{
        chatWith: string;
        isOnline: boolean;
      }>
    ) => {
      const { chatWith, isOnline } = action.payload;
      const chat = state.chats.find((chat) => chat.chatWith === chatWith);
      if (chat) {
        chat.receiperOnline = isOnline;
      }
    },
    setReceiverTyping: (
      state,
      action: PayloadAction<{
        chatWith: string;
        isTyping: boolean;
      }>
    ) => {
      const { chatWith, isTyping } = action.payload;
      const chat = state.chats.find((chat) => chat.chatWith === chatWith);
      if (chat) {
        chat.receiperTyping = isTyping;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewChat.fulfilled, (state, action) => {
        const newChat: ChatType = {
          id: action.payload.chat_id,
          chatWith: action.payload.receiverPublicKey,
          username: null,
          image: "default",
          unReadMessages: 0,
          lastMessage: null,
          messages: [],
          receiperOnline: false,
          receiperTyping: false,
        };
        state.chats.push(newChat);
        saveToLocalStorage(state.chats);
      })
      .addCase(joinChat.fulfilled, (state, action) => {
        const isChatExist = state.chats.find(
          (chat) => chat.id === action.payload.chat_id
        );
        if (isChatExist) return;
        const newChat: ChatType = {
          id: action.payload.chat_id,
          chatWith: action.payload.chatWith,
          username: null,
          image: "default",
          unReadMessages: 0,
          lastMessage: null,
          messages: [],
          receiperOnline: false,
          receiperTyping: false,
        };
        state.chats.push(newChat);
        saveToLocalStorage(state.chats);
      });
  },
});

export const {
  setChat,
  setUsername,
  setImage,
  setNewMessage,
  clearUnReadMessages,
  setReceiverOnline,
  setReceiverTyping,
  getNewMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
