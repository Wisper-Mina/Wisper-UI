import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { ChatResponse } from "@/types/messages";

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
  },
});

export const { setChat } = chatSlice.actions;

export default chatSlice.reducer;
