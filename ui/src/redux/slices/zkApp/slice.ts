import ZkAppWorkerClient from "@/lib/zkAppWorkerClient";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  zkProgram: null | ZkAppWorkerClient;
} = {
  zkProgram: null,
};

export const zkAppSlice = createSlice({
  name: "zkApp",
  initialState,
  reducers: {
    setZkProgram: (
      state,
      action: PayloadAction<{
        zkProgram: ZkAppWorkerClient;
      }>
    ) => {
      state.zkProgram = action.payload.zkProgram;
    },
  },
});

export const { setZkProgram } = zkAppSlice.actions;

export default zkAppSlice.reducer;
