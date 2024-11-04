import {
  Poseidon,
  SelfProof,
  ZkProgram,
  Field,
  PublicKey,
  Struct,
  Signature,
  MerkleWitness as BaseMerkleWitness,
  SmartContract,
  state,
  State,
  method,
  MerkleTree,
} from 'o1js';

const MERKLE_TREE_HEIGHT = 8; // Adjust based on your needs
class MerkleWitness extends BaseMerkleWitness(MERKLE_TREE_HEIGHT) {}

export class PrivateInputs extends Struct({
  messageSignature: Signature,
  merklePath: MerkleWitness,
}) {}

export class MessageProof extends Struct({
  senderPublicKey: PublicKey,
  messageHash: Field,
  merkleRoot: Field,
}) {}

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

        // Convert signature to field elements
        const messageSignatureFields = privateInput.messageSignature.toFields();

        // Verify the Merkle path
        const calculatedRoot = privateInput.merklePath.calculateRoot(
          Poseidon.hash(messageSignatureFields)
        );
        calculatedRoot.assertEquals(publicInput.merkleRoot);
      },
    },
    // Recursive proof verification
    verifyMessageWithPrevious: {
      privateInputs: [PrivateInputs, SelfProof],

      async method(
        publicInput: MessageProof,
        privateInput: PrivateInputs,
        previousProof: SelfProof<MessageProof, void>
      ) {
        // Step 1: Verify the previous proof
        previousProof.verify();

        // Verify the signature of the message
        const isSignatureValid = privateInput.messageSignature.verify(
          publicInput.senderPublicKey,
          publicInput.messageHash.toFields()
        );
        isSignatureValid.assertTrue();

        // Convert signature to field elements
        const messageSignatureFields = privateInput.messageSignature.toFields();

        // Verify the Merkle path
        const calculatedRoot = privateInput.merklePath.calculateRoot(
          Poseidon.hash(messageSignatureFields)
        );
        calculatedRoot.assertEquals(publicInput.merkleRoot);
      },
    },
  },
});

await MessageVerificationProgram.compile();

export class MessageVerificationProgramProof extends ZkProgram.Proof(
  MessageVerificationProgram
) {}

const MESSAGE_TREE_DEPTH = 10;
export class Wisper extends SmartContract {
  @state(Field) merkleRoot = State<Field>();
  @state(PublicKey) hostUser = State<PublicKey>();
  @state(PublicKey) guestUser = State<PublicKey>();
  @state(Field) timestamp = State<Field>();
  @state(Field) chatId = State<Field>();

  init() {
    super.init();
    this.merkleRoot.set(Field(0));
    this.hostUser.set(PublicKey.empty());
    this.guestUser.set(PublicKey.empty());
    this.timestamp.set(Field(0));
    this.chatId.set(Field(0));
  }

  @method async startChat(
    hostUser: PublicKey,
    guestUser: PublicKey,
    chatId: Field
  ) {
    const senderPublicKey = this.sender.getAndRequireSignature();
    hostUser.assertEquals(senderPublicKey);

    this.guestUser.requireEquals(this.guestUser.get());
    const storedGuestUser = this.guestUser.get();
    storedGuestUser.assertEquals(PublicKey.empty());

    this.chatId.requireEquals(this.chatId.get());
    const storedChatId = this.chatId.get();
    storedChatId.assertEquals(Field(0));

    this.guestUser.set(guestUser);
    this.chatId.set(chatId);

    const emptyMerkleRoot = new MerkleTree(MESSAGE_TREE_DEPTH).getRoot();
    this.merkleRoot.set(emptyMerkleRoot);
  }

  //Needed info to verification can be added to parameters.
  @method async settleChat(
    hostUser: PublicKey,
    guestUser: PublicKey,
    chatId: Field,
    merkleRoot: Field,
    timestamp: Field,
    proof: MessageVerificationProgramProof
  ) {
    const senderPublicKey = this.sender.getAndRequireSignature();

    // Check if senderPublicKey is either hostUser or guestUser
    const isHost = hostUser.equals(senderPublicKey);
    const isGuest = guestUser.equals(senderPublicKey);
    isHost
      .or(isGuest)
      .assertTrue('Sender must be either the host or guest user.');

    this.hostUser.requireEquals(this.hostUser.get());
    const storedHostUser = this.hostUser.get();
    storedHostUser.assertEquals(hostUser);

    this.guestUser.requireEquals(this.guestUser.get());
    const storedGuestUser = this.guestUser.get();
    storedGuestUser.assertEquals(guestUser);

    this.chatId.requireEquals(this.chatId.get());
    const storedChatId = this.chatId.get();
    storedChatId.assertEquals(chatId);

    this.merkleRoot.requireEquals(this.merkleRoot.get());
    const storedMerkleRoot = this.merkleRoot.get();
    storedMerkleRoot.assertEquals(new MerkleTree(MESSAGE_TREE_DEPTH).getRoot());

    this.timestamp.requireEquals(this.timestamp.get());
    const storedTimestamp = this.timestamp.get();
    storedTimestamp.assertEquals(Field(0));

    // Call the verify function from ZKProgram and verify the proof
    proof.verify();

    this.merkleRoot.set(merkleRoot);
    this.timestamp.set(timestamp);
  }
}
