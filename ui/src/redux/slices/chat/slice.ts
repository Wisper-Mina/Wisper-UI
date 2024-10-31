import { v4 as uuidv4 } from "uuid";

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { ChatResponse, ChatType, ImageType } from "@/types/messages";
import { getCurrentTime } from "@/utils/dateConverter";
import { createNewChat, joinChat } from "./thunk";

const initialState: ChatResponse = {
  chats: [],
  pubKey58: "",
};

const saveToLocalStorage = (
  pubKey58: string,
  chats: ChatType[],
  signingPrivateKey58?: string
) => {
  const chatsToSave = chats.map((chat) => {
    return {
      ...chat,
      receiperOnline: false,
      receiperTyping: false,
    };
  });

  const localStore = localStorage.getItem(`chat-${pubKey58}`);
  if (localStore) {
    const localData = JSON.parse(localStore);
    if (localData.signingPrivateKey58) {
      signingPrivateKey58 = localData.signingPrivateKey58;
    }
  }

  const saveData = {
    pubKey58,
    chats: chatsToSave,
    signingPrivateKey58: signingPrivateKey58 ?? "",
  };
  localStorage.setItem(`chat-${pubKey58}`, JSON.stringify(saveData));
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUserPubKey: (state, action: PayloadAction<string>) => {
      state.pubKey58 = action.payload;
    },
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
        saveToLocalStorage(state.pubKey58, state.chats);
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
        saveToLocalStorage(state.pubKey58, state.chats);
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
        saveToLocalStorage(state.pubKey58, state.chats);
      }
    },
    getNewMessage: (
      state,
      action: PayloadAction<{
        chatWith: string;
        newMessage: string;
        unRead: boolean;
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
        if (action.payload.unRead) {
          chat.unReadMessages += 1;
        }
        saveToLocalStorage(state.pubKey58, state.chats);
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
        saveToLocalStorage(state.pubKey58, state.chats);
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
        saveToLocalStorage(
          action.payload.senderPublicKey,
          state.chats,
          action.payload.signingPrivateKey
        );
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
        saveToLocalStorage(state.pubKey58, state.chats);
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
  setUserPubKey,
} = chatSlice.actions;

export default chatSlice.reducer;
