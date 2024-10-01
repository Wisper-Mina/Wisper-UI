import { jest } from '@jest/globals';
import { PrivateKey, Signature, Poseidon, Field, MerkleTree, UInt64, Proof} from "o1js";
import { EncryptedData } from '../interfaces/message.interface';
import { MessagePackage } from '../interfaces/MessagePackage.interface';
import { encrypt, deriveKeyFromForeignCurve, decrypt } from '../encryption/aes-gcm'
import { ECDHSecp256k1, Secp256k1Curve } from '../ecdh-secp256k1/ecdh-secp256k1';
import { generateProof } from '../proof/generateProof';
import { MessageVerificationProgram } from '../proof/proof';
const MERKLE_TREE_HEIGHT = 8;

jest.useFakeTimers();

describe('Chat functions', () => {
    //These keys will use for signing messages
    const signingPrivateKey = PrivateKey.random();
    const signingPublicKey = signingPrivateKey.toPublicKey(); 

    //These keys will use for create encryption key
    const encryptionPrivKey1 = Secp256k1Curve.Scalar.random();
    const encryptionPrivKey2 = Secp256k1Curve.Scalar.random();
    const ecdh = new ECDHSecp256k1();
    const encryptionPubKey1 = ecdh.publicKey(encryptionPrivKey1);
    const encryptionPubKey2 = ecdh.publicKey(encryptionPrivKey2);

    let pureMessage = "Hello Bob, you should get this message."
    let messagePackage: MessagePackage;


    beforeAll(async () => {
        await MessageVerificationProgram.compile();

        //This is the key we will use for encryption
        const sharedSecret = ECDHSecp256k1.computeSharedSecret(encryptionPrivKey1, encryptionPubKey2);
        const sharedKey = deriveKeyFromForeignCurve(sharedSecret);

        //This is the cipher text that we will send from one client to other
        const encryptedMessage: EncryptedData = encrypt(sharedKey, pureMessage);

        const message = pureMessage.split('').map(char => Field(char.charCodeAt(0)));
        const messageHash = Poseidon.hash(message);
        const messageSignature = Signature.create(
        signingPrivateKey,
            messageHash.toFields()
        );
        const messageSignatureFields = messageSignature.toFields();
        const merkleTree = new MerkleTree(MERKLE_TREE_HEIGHT);
        merkleTree.setLeaf(0n, Poseidon.hash(messageSignatureFields));
        const messageIndex = 0;
        const sequenceNumber = UInt64.from(1);
        const previousSequenceNumber = UInt64.from(0);
        const proof = await generateProof(signingPublicKey, messageHash, messageSignature, merkleTree, messageIndex, sequenceNumber, previousSequenceNumber);
        
        //This is the package clients post each other
        messagePackage = { encryptedMessage: encryptedMessage, proof: proof };
    });
    it('should decrypt and get exact message', async () => {
        const sharedSecret = ECDHSecp256k1.computeSharedSecret(encryptionPrivKey2, encryptionPubKey1);
        const sharedKey = deriveKeyFromForeignCurve(sharedSecret);
        const decryptedMessage = decrypt(sharedKey, messagePackage.encryptedMessage.iv, messagePackage.encryptedMessage.encryptedData, messagePackage.encryptedMessage.authTag);

        expect(pureMessage).toStrictEqual(decryptedMessage);
    })
    it('should verify the proof', async () => {
        const isValid = await MessageVerificationProgram.verify(messagePackage.proof);
        expect(isValid).toBe(true);
    })
});
