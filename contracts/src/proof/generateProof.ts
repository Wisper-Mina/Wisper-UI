import { Field, PublicKey, Signature, MerkleTree, UInt64, MerkleWitness as BaseMerkleWitness, ZkProgram } from 'o1js';
import { MessageProof } from '../structs/MessageProof';
import { PrivateInputs } from '../structs/PrivateInputs';
import { MessageVerificationProgram } from './proof';

const MERKLE_TREE_HEIGHT = 8; // Adjust based on your needs
class MerkleWitness extends BaseMerkleWitness(MERKLE_TREE_HEIGHT) { }
export async function generateProof(
  senderPublicKey: PublicKey,
  messageHash: Field,
  messageSignature: Signature,
  merkleTree: MerkleTree,
  messageIndex: number,
  sequenceNumber: UInt64,
  previousSequenceNumber: UInt64
) {
  const merkleRoot = merkleTree.getRoot();
  const merklePath = new MerkleWitness(merkleTree.getWitness(BigInt(messageIndex)));
  
  const publicInput = new MessageProof({
    senderPublicKey,
    messageHash,
    merkleRoot,
    sequenceNumber,
  });

  const privateInput = new PrivateInputs({
    messageSignature,
    merklePath,
    previousSequenceNumber,
  });

  const proof = await MessageVerificationProgram.verifyMessage(
    publicInput,
    privateInput
  );

  return proof;
}