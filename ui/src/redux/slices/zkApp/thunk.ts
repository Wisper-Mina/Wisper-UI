import { createAsyncThunk } from "@reduxjs/toolkit";
import { PublicKey } from "o1js";

export const setPublicKeyCookie = createAsyncThunk(
  "session/setSessionCookie",
  async (
    data: {
      publicKeyBase58: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("/api/cookie/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicKey: data.publicKeyBase58,
        }),
      });
      if (response.status === 200) {
        return data;
      }
      return rejectWithValue("Failed to set session cookie");
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
