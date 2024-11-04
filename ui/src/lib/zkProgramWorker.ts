/* eslint-disable @typescript-eslint/no-explicit-any */
import { PublicKey, Mina, fetchAccount } from "o1js";

import { MessageVerificationProgram } from "../../../mina/build/src/proof/proof.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
const state = {
  MessageVerificationProgram: null as null | typeof MessageVerificationProgram,
};

// ---------------------------------------------------------------------------------------

const functions = {
  setActiveInstanceToDevnet: async () => {
    const Network = Mina.Network(
      "https://api.minascan.io/node/devnet/v1/graphql"
    );
    console.log("Devnet network instance configured.");
    Mina.setActiveInstance(Network);
  },
  loadProgram: async () => {
    console.log("Loading MessageVerificationProgram...");
    const { MessageVerificationProgram } = await import(
      "../../../mina/build/src/proof/proof.js"
    );
    console.log("MessageVerificationProgram loaded.");
    state.MessageVerificationProgram = MessageVerificationProgram;
  },
  compileProgram: async () => {
    console.log(
      "Compiling MessageVerificationProgram...",
      state.MessageVerificationProgram
    );
    await state.MessageVerificationProgram!.compile();
    console.log("MessageVerificationProgram compiled.");
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkProgramWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkProgramWorkerReponse = {
  id: number;
  data: any;
};

addEventListener(
  "message",
  async (event: MessageEvent<ZkProgramWorkerRequest>) => {
    const returnData = await functions[event.data.fn](event.data.args);

    const message: ZkProgramWorkerReponse = {
      id: event.data.id,
      data: returnData,
    };
    postMessage(message);
  }
);

console.log("Worker Initialized Successfully.");
