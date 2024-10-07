import { jest } from '@jest/globals';
import { ECDHSecp256k1, Secp256k1Curve } from '../ecdh-secp256k1/ecdh-secp256k1';

jest.useFakeTimers();

describe('ECDH Secp256k1', () => {
    it('should generate a key pair correctly', () => {
        const ecdh = new ECDHSecp256k1();
        const { privateKey, publicKey } = ecdh.generateKey();

        const expectedPublicKey = Secp256k1Curve.generator.scale(privateKey);
        expect(publicKey.toBigint()).toStrictEqual(expectedPublicKey.toBigint());
    });

    it('should compute public key correctly from private key', () => {
        const ecdh = new ECDHSecp256k1();
        const privateKey = Secp256k1Curve.Scalar.random();
        const expectedPublicKey = Secp256k1Curve.generator.scale(privateKey);

        const computedPublicKey = ecdh.publicKey(privateKey);

        expect(computedPublicKey.toBigint()).toStrictEqual(expectedPublicKey.toBigint());
    });

    it('should compute the shared secret correctly', () => {
        const ecdh = new ECDHSecp256k1();
        const privateKey1 = Secp256k1Curve.Scalar.random();
        const privateKey2 = Secp256k1Curve.Scalar.random();

        const publicKey1 = ecdh.publicKey(privateKey1);
        const publicKey2 = ecdh.publicKey(privateKey2);

        const sharedSecret1 = ECDHSecp256k1.computeSharedSecret(privateKey1, publicKey2);
        const sharedSecret2 = ECDHSecp256k1.computeSharedSecret(privateKey2, publicKey1);

        expect(sharedSecret1.toBigint()).toStrictEqual(sharedSecret2.toBigint());
    });
});