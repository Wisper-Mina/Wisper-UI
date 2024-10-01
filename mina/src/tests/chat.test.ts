import { jest } from '@jest/globals';
import { PrivateKey, Signature, Bool, Field, Poseidon, MerkleTree, UInt64 } from "o1js";
import { EncryptedData } from '../interfaces/message.interface';
import { generateKey, encrypt, decrypt } from '../encryption/aes-gcm'
import { MessageVerificationProgram } from '../proof/proof';
import { generateProof } from '../proof/generateProof';

jest.useFakeTimers();

describe('AES-GCM algorythm functions',() => {
    it('should encrypt and decrypt the data correctly', () => {
        const key = generateKey();
        const message = "Message itsel!!"
        const encryptedMessage: EncryptedData = encrypt(key, message);
        const decryptedMessage = decrypt(key, encryptedMessage.iv, encryptedMessage.encryptedData, encryptedMessage.authTag);
        expect(message).toStrictEqual(decryptedMessage);
    });
    it('signature of the signer should be the message sender ', () => {
        //Wallet key pairs
        const client1PrivateKey = PrivateKey.random();
        const client1PublicKey = client1PrivateKey.toPublicKey();

        const client2PrivateKey = PrivateKey.random();
        const client2PublicKey = client2PrivateKey.toPublicKey();
        
        // we can add any extra data to sign to prevent MITM attacks
        const signature1 = Signature.create(client1PrivateKey, client2PublicKey.toFields());
        const signature2 = Signature.create(client2PrivateKey, client1PublicKey.toFields());


        const isVerify1 = signature1.verify(client1PublicKey, client2PublicKey.toFields());
        const isVerify2 = signature2.verify(client2PublicKey, client1PublicKey.toFields());
        expect(isVerify1).toStrictEqual(new Bool(true));
        expect(isVerify2).toStrictEqual(new Bool(true));
    });
    it('should send message ', async () => {
        console.log("BURDA");
        const MERKLE_TREE_HEIGHT = 8; 
        const { verificationKey } = await MessageVerificationProgram.compile();
        
        // Log after async function completes
        console.log("After compilation", verificationKey);
        // chatting key pairs
        console.log("BURDA");
        // const senderPrivateKey = PrivateKey.random();
        // const senderPublicKey = senderPrivateKey.toPublicKey(); 
        // console.log("BURDA");
        // const pureMessage = "Message itsel!!"
        // const message = pureMessage.split('').map(char => Field(char.charCodeAt(0)));
        // const messageHash = Poseidon.hash(message);
        // const messageSignature = Signature.create(
        // senderPrivateKey,
        //     messageHash.toFields()
        // );
        // const messageSignatureFields = messageSignature.toFields();
        // console.log("BURDA");

        // const merkleTree = new MerkleTree(MERKLE_TREE_HEIGHT);
        // merkleTree.setLeaf(0n, Poseidon.hash(messageSignatureFields));

        // const sequenceNumber = UInt64.from(1);
        // const previousSequenceNumber = UInt64.from(0);
        // console.log("BURDA");

        // const proof = await generateProof(senderPublicKey, messageHash, messageSignature, merkleTree, 0, sequenceNumber, previousSequenceNumber);
        // const isValid = await MessageVerificationProgram.verify(proof);
        // expect(isValid).toStrictEqual(new Bool(true));
        // console.log("BURDA");

    });

});
