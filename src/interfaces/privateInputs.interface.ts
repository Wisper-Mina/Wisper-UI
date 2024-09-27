import {Signature} from 'o1js';
import { MessageProof } from './messageProof.interface';

// Interface for the messageProof
export interface PrivateInputs {
  previousProof: MessageProof,
  messageSignature: Signature,
}