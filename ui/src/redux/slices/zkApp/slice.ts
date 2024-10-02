import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import ZkappWorkerClient from "@/lib/zkAppWorkerClient";
import { setPublicKeyCookie } from "./thunk";
import { ImageType } from "@/types/messages";

export interface ZkAppState {
  zkappWorkerClient: ZkappWorkerClient | null;
  hasWallet: boolean | null;
  accountExists: boolean;
  publicKeyBase58: string | null;
  image: ImageType;
}

const initialState: ZkAppState = {
  zkappWorkerClient: null,
  hasWallet: null,
  accountExists: false,
  publicKeyBase58: null,
  image: "default",
};

export const zkAppSlice = createSlice({
  name: "zkApp",
  initialState,
  reducers: {
    setZkappWorkerClient: (state, action: PayloadAction<ZkappWorkerClient>) => {
      state.zkappWorkerClient = action.payload;
    },
    setHasWallet: (state, action: PayloadAction<boolean>) => {
      state.hasWallet = action.payload;
    },
    setAccountExists: (state, action: PayloadAction<boolean>) => {
      state.accountExists = action.payload;
    },
    changeProfileImage: (state, action: PayloadAction<ImageType>) => {
      state.image = action.payload;
    },
    setPublicKey: (state, action: PayloadAction<string>) => {
      state.publicKeyBase58 = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setPublicKeyCookie.fulfilled, (state, action) => {
      state.publicKeyBase58 = action.payload
        ? action.payload.publicKeyBase58
        : null;
    });
  },
});

export const {
  setZkappWorkerClient,
  setHasWallet,
  setAccountExists,
  changeProfileImage,
  setPublicKey,
} = zkAppSlice.actions;

export default zkAppSlice.reducer;
