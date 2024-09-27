import {
  Field,
  PublicKey,
  Signature,
  ZkProgram,
  Struct,
  MerkleTree,
  MerkleWitness as BaseMerkleWitness,
  Poseidon,
  UInt64,
  PrivateKey
} from 'o1js';

const MERKLE_TREE_HEIGHT = 8; // Adjust based on your needs
class MerkleWitness extends BaseMerkleWitness(MERKLE_TREE_HEIGHT) { }


class MessageProof extends Struct({
  senderPublicKey: PublicKey,
  messageHash: Field,
  merkleRoot: Field,
  sequenceNumber: UInt64,
}) {}

class PrivateInputs extends Struct({
  messageSignature: Signature,
  merklePath: MerkleWitness,
  previousSequenceNumber: UInt64,
}) {}


const MessageVerificationProgram = ZkProgram({
  name: 'MessageVerification',
  publicInput: MessageProof,
  privateInput: PrivateInputs,

  methods: {
    verifyMessage: {
      privateInputs: [PrivateInputs],

      async method(publicInput: MessageProof, privateInput: PrivateInputs) {
        // Verify the signature of the message
        const isSignatureValid = privateInput.messageSignature.verify(
          publicInput.senderPublicKey,
          publicInput.messageHash.toFields()
        );
        isSignatureValid.assertTrue();

        // Verify the Merkle path
        const calculatedRoot = privateInput.merklePath.calculateRoot(publicInput.messageHash);
        calculatedRoot.assertEquals(publicInput.merkleRoot);

        // Verify that the sequence number is greater than the previous one
        publicInput.sequenceNumber.assertGreaterThan(privateInput.previousSequenceNumber);

          // Additional checks can be added here as needed
          //for example message itself
      },
      },
  },
});



async function generateProof(
  senderPublicKey: PublicKey,
  messageHash: Field,
  messageSignature: Signature,
  merkleTree: MerkleTree,
  messageIndex: number,
  sequenceNumber: UInt64,
  previousSequenceNumber: UInt64
): Promise<any> {
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
await MessageVerificationProgram.compile();
const senderPrivateKey = PrivateKey.random();
const senderPublicKey = senderPrivateKey.toPublicKey(); 
const pureMessage = "Message itsel!!"
const message = pureMessage.split('').map(char => Field(char.charCodeAt(0)));
const messageHash = Poseidon.hash(message);
const messageSignature = Signature.create(
  senderPrivateKey,
    messageHash.toFields()
);

const merkleTree = new MerkleTree(MERKLE_TREE_HEIGHT);
merkleTree.setLeaf(0n, messageHash);

const sequenceNumber = UInt64.from(1);
const previousSequenceNumber = UInt64.from(0);

generateProof(
  senderPublicKey,
  messageHash,
  messageSignature,
  merkleTree,
  0,
  sequenceNumber,
  previousSequenceNumber
).then((proof) => {
  console.log('Proof generated:', proof);
});
