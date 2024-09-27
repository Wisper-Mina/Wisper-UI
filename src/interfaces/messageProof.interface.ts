import {Field,PublicKey} from 'o1js';

// Interface for the messageProof
export interface MessageProof {
    senderPublicKey: PublicKey,
    messageHash: Field,
    previousProofHash: Field,
}