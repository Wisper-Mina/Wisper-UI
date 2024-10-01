import {
  Poseidon,
  ZkProgram,
} from 'o1js';
import { MessageProof } from '../structs/MessageProof';
import { PrivateInputs } from '../structs/PrivateInputs';

export const MessageVerificationProgram = ZkProgram({
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

        const messageSignatureFields = privateInput.messageSignature.toFields();

        // Verify the Merkle path
        const calculatedRoot = privateInput.merklePath.calculateRoot(Poseidon.hash(messageSignatureFields));
        calculatedRoot.assertEquals(publicInput.merkleRoot);

        // Verify that the sequence number is greater than the previous one
        publicInput.sequenceNumber.assertGreaterThan(privateInput.previousSequenceNumber);
      },
      },
  },
});