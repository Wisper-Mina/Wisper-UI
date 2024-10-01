import { createForeignCurveV2, Crypto, CanonicalForeignField, ForeignCurveV2 } from "o1js";

// Define a custom elliptic curve based on the Secp256k1 parameters, which is widely used in cryptographic applications.
class Secp256k1Curve extends createForeignCurveV2(Crypto.CurveParams.Secp256k1) { }

// Export the ECDH implementation and the custom Secp256k1Curve for use in other modules.
export { ECDHSecp256k1, Secp256k1Curve };

class ECDHSecp256k1 {
  // Static reference to the generator point G on the Secp256k1 curve.
  // This point is used to generate public keys and to compute shared secrets.
  private static G = Secp256k1Curve.generator;

  /**
   * Generates a new ECDH key pair.
   * 
   * The key pair consists of a private key and a corresponding public key.
   * - The private key is a randomly generated scalar in the range [1, n-1], where n is the order of the curve.
   * - The public key is obtained by scaling the generator point G by the private key.
   * 
   * @returns {Object} - An object containing the private key and public key.
   * @property {CanonicalForeignField} privateKey - The private key used for encryption.
   * @property {ForeignCurveV2} publicKey - The public key derived from the private key.
   */
  generateKey(): { privateKey: CanonicalForeignField, publicKey: ForeignCurveV2 } {
    // Generate a random private key.
    const privateKey = Secp256k1Curve.Scalar.random();

    // Compute the public key by multiplying the generator point G with the private key.
    // The public key is a point on the elliptic curve, calculated as P = dG, where d is the private key and G is the generator point.
    const publicKey = ECDHSecp256k1.G.scale(privateKey);

    return { privateKey, publicKey };
  }

  /**
   * Computes the public key from a given private key.
   * 
   * This method performs the scalar multiplication of the generator point G by the provided private key.
   * 
   * @param {CanonicalForeignField} privateKey - The private key for which the public key is to be computed.
   * @returns {ForeignCurveV2} - The computed public key as a point on the elliptic curve.
   */
  publicKey(privateKey: CanonicalForeignField): ForeignCurveV2 {
    return ECDHSecp256k1.G.scale(privateKey);
  }

  /**
   * Computes the shared secret given the local private key and the peer's public key.
   * 
   * The shared secret is derived by performing scalar multiplication of the peer's public key with the local private key.
   * This operation relies on the elliptic curve's property where both parties arrive at the same shared secret.
   * Mathematically, the shared secret is computed as S = dP, where d is the local private key and P is the peer's public key.
   *
   * @param {CanonicalForeignField} privateKey - The local private key.
   * @param {ForeignCurveV2} peersPublicKey - The public key of the peer.
   * @returns {ForeignCurveV2} - The computed shared secret.
   */
  static computeSharedSecret(privateKey: CanonicalForeignField, peersPublicKey: ForeignCurveV2): ForeignCurveV2 {
    // Ensure that the peer's public key is a valid point on the elliptic curve.
    peersPublicKey.assertOnCurve();

    // Compute the shared secret by multiplying the peer's public key by the local private key.
    return peersPublicKey.scale(privateKey);
  }
}