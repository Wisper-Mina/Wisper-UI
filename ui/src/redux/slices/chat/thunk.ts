import { createAsyncThunk } from "@reduxjs/toolkit";

export const createNewChat = createAsyncThunk(
  "chat/createNewChat",
  async (
    data: {
      senderPublicKey: string;
      receipientPublicKey: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch("/api/chat_id/create", {
        method: "POST",
        body: JSON.stringify({
          senderPublicKey: data.senderPublicKey,
          receiverPublicKey: data.receipientPublicKey,
        }),
      }).then((r) => r.json());
      if (res.status === 200) {
        return res?.data;
      }
      return rejectWithValue("Failed to create chat");
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
