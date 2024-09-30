import { assert, CanonicalForeignField, ZkProgram } from 'o1js';
import { ECDHSecp256k1, Secp256k1Curve } from './ecdh-scp256k1/ecdh-secp256k1.js';

let ecdhVerificationProgram = ZkProgram({
    name: 'ecdh-secp256k1-verification',
    publicOutput: Secp256k1Curve,
    methods: {
        verifyECDHSecp256k1: {
            privateInputs: [Secp256k1Curve.Scalar.Canonical, Secp256k1Curve],
            async method(
                userPrivateKey: CanonicalForeignField,
                peersPublicKey: Secp256k1Curve,
            ) {
                return ECDHSecp256k1.computeSharedSecret(userPrivateKey, peersPublicKey);
            },
        },
    },
});

let { verifyECDHSecp256k1 } = await ecdhVerificationProgram.analyzeMethods();

console.log(verifyECDHSecp256k1.summary());

console.time('compile');
const forceRecompile = false;
await ecdhVerificationProgram.compile({ forceRecompile });
console.timeEnd('compile');

console.time('generate ECDH keys');
const ecdhInstance = new ECDHSecp256k1();
const { privateKey: alicePrivateKey, publicKey: alicePublicKey } = ecdhInstance.generateKey();
const { privateKey: bobPrivateKey, publicKey: bobPublicKey } = ecdhInstance.generateKey();
console.timeEnd('generate ECDH keys');

console.time('prove Alice');
let proofAlice = await ecdhVerificationProgram.verifyECDHSecp256k1(alicePrivateKey, bobPublicKey);
console.timeEnd('prove Alice');

console.time('prove Bob');
let proofBob = await ecdhVerificationProgram.verifyECDHSecp256k1(bobPrivateKey, alicePublicKey);
console.timeEnd('prove Bob');


console.time('compare Alice & Bob secret shares')
console.log(proofAlice.publicOutput.toBigint())
console.log(proofBob.publicOutput.toBigint())
console.timeEnd('compare Alice & Bob secret shares')


console.time('verify Alice');
let isVerifiedAlice = await ecdhVerificationProgram.verify(proofAlice);
console.timeEnd('verify Alice');


console.time('verify Bob');
let isVerifiedBob = await ecdhVerificationProgram.verify(proofBob);
console.timeEnd('verify Bob');

console.log(`Proof verified Alice: ${isVerifiedAlice}`);
console.log(`Proof verified Bob: ${isVerifiedBob}`);
