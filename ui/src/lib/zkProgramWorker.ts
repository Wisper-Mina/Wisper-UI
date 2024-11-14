/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Mina,
  fetchAccount,
  PublicKey,
  PrivateKey,
  Field,
  Poseidon,
  Signature,
  MerkleTree,
} from "o1js";
import * as crypto from "crypto";

import { MessageVerificationProgram } from "../../../mina/build/src/proof/proof.js";
import { CryptoUtils } from "../../../mina/build/src/ecdh-pallas/ecdh-pallas.js";
import { generateProof } from "../../../mina/build/src/proof/generateProof.js";

const MERKLE_TREE_HEIGHT = 8; // Adjust based on your needs

const state = {
  MessageVerificationProgram: null as null | typeof MessageVerificationProgram,
};

export interface EncryptedData {
  iv: string;
  encryptedData: string;
  authTag: string;
}

export function encrypt(key: Buffer, message: string): EncryptedData {
  const iv: Buffer = crypto.randomBytes(12); // 96 bits IV
  const cipher: crypto.CipherGCM = crypto.createCipheriv(
    "aes-256-gcm",
    key,
    iv
  );

  let encrypted: string = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag: string = cipher.getAuthTag().toString("hex");

  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted,
    authTag: authTag,
  };
}

// Function to decrypt a message
export function decrypt(
  key: Buffer,
  iv: string,
  encryptedData: string,
  authTag: string
): string {
  const decipher: crypto.DecipherGCM = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  let decrypted: string = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

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
  decryptMessage: async (args: {
    signingPrivateKey58: string;
    receiverPublicKey58: string;
    encryptedMessage: EncryptedData;
  }): Promise<string> => {
    const signingPrivateKey = PrivateKey.fromBase58(args.signingPrivateKey58);
    const receiverPublicKey = PublicKey.fromBase58(args.receiverPublicKey58);

    // This is the key we will use for encryption
    const sharedSecret = CryptoUtils.computeSharedSecret(
      signingPrivateKey,
      receiverPublicKey
    );

    const sharedKey = CryptoUtils.fieldToBuffer(sharedSecret);

    const decryptedMessage = decrypt(
      sharedKey,
      args.encryptedMessage.iv,
      args.encryptedMessage.encryptedData,
      args.encryptedMessage.authTag
    );
    return decryptedMessage;
  },
  generateProof: async (args: {
    signingPrivateKey58: string;
    pureMessage: string;
    receiverPublicKey58: string;
    messageIndex: number;
  }): Promise<{ encryptedMessage: EncryptedData; proof: any }> => {
    const merkleTree = new MerkleTree(MERKLE_TREE_HEIGHT);

    const signingPrivateKey = PrivateKey.fromBase58(args.signingPrivateKey58);
    const signingPublicKey = signingPrivateKey.toPublicKey();
    const receiverPublicKey = PublicKey.fromBase58(args.receiverPublicKey58);

    // This is the key we will use for encryption
    const sharedSecret = CryptoUtils.computeSharedSecret(
      signingPrivateKey,
      receiverPublicKey
    );

    const sharedKey = CryptoUtils.fieldToBuffer(sharedSecret);

    //This is the cipher text that we will send from one client to other
    const encryptedMessage: EncryptedData = encrypt(
      sharedKey,
      args.pureMessage
    );

    const message = args.pureMessage
      .split("")
      .map((char) => Field(char.charCodeAt(0)));
    const messageHash = Poseidon.hash(message);
    const messageSignature = Signature.create(
      signingPrivateKey,
      messageHash.toFields()
    );

    const messageSignatureFields = messageSignature.toFields();

    const leaf = BigInt(args.messageIndex);
    merkleTree.setLeaf(leaf, Poseidon.hash(messageSignatureFields));

    const proof = await generateProof(
      signingPublicKey,
      messageHash,
      messageSignature,
      merkleTree,
      args.messageIndex
    );

    return { encryptedMessage: encryptedMessage, proof: proof.toJSON() };
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
