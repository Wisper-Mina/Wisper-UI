import {
  Field,
  PublicKey,
  Struct,
  UInt64,
} from 'o1js';

export class MessageProof extends Struct({
  senderPublicKey: PublicKey,
  messageHash: Field,
  merkleRoot: Field,
  sequenceNumber: UInt64,
}) {}