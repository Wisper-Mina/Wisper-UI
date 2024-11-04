/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mina, fetchAccount, PublicKey } from "o1js";

import { MessageVerificationProgram } from "../../../mina/build/src/proof/proof.js";

const state = {
  MessageVerificationProgram: null as null | typeof MessageVerificationProgram,
};

// ---------------------------------------------------------------------------------------

const functions = {
  setActiveInstanceToDevnet: async () => {
    const Network = Mina.Network(
      "https://api.minascan.io/node/devnet/v1/graphql"
    );
    Mina.setActiveInstance(Network);
  },
  loadProgram: async () => {
    const { MessageVerificationProgram } = await import(
      "../../../mina/build/src/proof/proof.js"
    );
    state.MessageVerificationProgram = MessageVerificationProgram;
  },
  compileProgram: async () => {
    await state.MessageVerificationProgram!.compile({
      forceRecompile: true,
    });
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
