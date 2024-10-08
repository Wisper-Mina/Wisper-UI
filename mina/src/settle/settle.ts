import { Field, SmartContract, state, State, method, PublicKey, MerkleTree } from 'o1js';

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

  @method async startChat (hostUser: PublicKey, guestUser: PublicKey, chatId: Field) {
    const senderPublicKey = this.sender.getAndRequireSignatureV2();
    hostUser.assertEquals(senderPublicKey);

    const storedGuestUser = this.guestUser.get();
    storedGuestUser.assertEquals(PublicKey.empty());

    const storedChatId = this.chatId.get();
    storedChatId.assertEquals(Field(0));

    this.guestUser.set(guestUser);
    this.chatId.set(chatId);

    const emptyMerkleRoot = (new MerkleTree(MESSAGE_TREE_DEPTH)).getRoot();
    this.merkleRoot.set(emptyMerkleRoot);
  }

  //Needed info to verification can be added to parameters.
  @method async settleChat(hostUser: PublicKey, guestUser: PublicKey, chatId: Field, merkleRoot: Field, timestamp: Field ) {
    const senderPublicKey = this.sender.getAndRequireSignatureV2();
    
    // Check if senderPublicKey is either hostUser or guestUser
    const isHost = hostUser.equals(senderPublicKey);
    const isGuest = guestUser.equals(senderPublicKey);
    isHost.or(isGuest).assertTrue("Sender must be either the host or guest user.");

    const storedHostUser = this.hostUser.get();
    storedHostUser.assertEquals(hostUser);

    const storedGuestUser = this.guestUser.get();
    storedGuestUser.assertEquals(guestUser);

    const storedChatId = this.chatId.get();
    storedChatId.assertEquals(chatId);

    const storedMerkleRoot = this.merkleRoot.get();
    storedMerkleRoot.assertEquals((new MerkleTree(MESSAGE_TREE_DEPTH)).getRoot());

    const storedTimestamp = this.timestamp.get();
    storedTimestamp.assertEquals(Field(0));

    // Call the verify function from ZKProgram and verify the proof
    
    this.merkleRoot.set(merkleRoot);
    this.timestamp.set(timestamp);
  }
}
