import { configureStore } from "@reduxjs/toolkit";

import zkAppReducer from "./slices/zkApp/slice";
import chatReducer from "./slices/chat/slice";
import overlayReducer from "./slices/overlaySlice";

export const store = configureStore({
  reducer: {
    zkApp: zkAppReducer,
    chat: chatReducer,
    overlay: overlayReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
