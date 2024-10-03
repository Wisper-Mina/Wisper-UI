import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import ZkappWorkerClient from "@/lib/zkAppWorkerClient";
import { ZkAppState } from "@/types/zkApp";

const initialState: ZkAppState = {
  zkappWorkerClient: null,
  hasWallet: null,
  accountExists: false,
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
  },
});

export const { setZkappWorkerClient, setHasWallet, setAccountExists } =
  zkAppSlice.actions;

export default zkAppSlice.reducer;
