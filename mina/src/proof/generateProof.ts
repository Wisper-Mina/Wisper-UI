import {
  Field,
  PublicKey,
  Signature,
  MerkleTree,
  MerkleWitness as BaseMerkleWitness,
  SelfProof,
  // SelfProof,
} from 'o1js';
import { MessageProof } from '../structs/MessageProof';
import { PrivateInputs } from '../structs/PrivateInputs';
import { MessageVerificationProgram } from './proof';

const MERKLE_TREE_HEIGHT = 8; // Adjust based on your needs
class MerkleWitness extends BaseMerkleWitness(MERKLE_TREE_HEIGHT) {}
export async function generateProof(
  senderPublicKey: PublicKey,
  messageHash: Field,
  messageSignature: Signature,
  merkleTree: MerkleTree,
  messageIndex: number
) {
  const merkleRoot = merkleTree.getRoot();
  const merklePath = new MerkleWitness(
    merkleTree.getWitness(BigInt(messageIndex))
  );

  const publicInput = new MessageProof({
    senderPublicKey,
    messageHash,
    merkleRoot,
  });

  const privateInput = new PrivateInputs({
    messageSignature,
    merklePath,
  });

  const proof = await MessageVerificationProgram.verifyMessage(
    publicInput,
    privateInput
  );

  return proof;
}

export async function generateProofWithPreviousProof(
  senderPublicKey: PublicKey,
  messageHash: Field,
  messageSignature: Signature,
  merkleTree: MerkleTree,
  messageIndex: number,
  previousProof: SelfProof<MessageProof, void>
) {
  const merkleRoot = merkleTree.getRoot();
  const merklePath = new MerkleWitness(
    merkleTree.getWitness(BigInt(messageIndex))
  );

  const publicInput = new MessageProof({
    senderPublicKey,
    messageHash,
    merkleRoot,
  });

  const privateInput = new PrivateInputs({
    messageSignature,
    merklePath,
  });

  const proof = await MessageVerificationProgram.verifyMessageWithPrevious(
    publicInput,
    privateInput,
    previousProof
  );

  return proof;
}
