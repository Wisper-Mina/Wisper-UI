const socket = io("http://localhost:8080"); // Socket sunucusuna bağlan

let chatId = "";
let pubkey = "";

const chatDiv = document.getElementById("chat");
const form = document.getElementById("message-form");
const input = document.getElementById("message");

var typingIndicator = document.getElementById("typing");

const chatInfo = document.getElementById("chatInfo");

const receiverStatus = document.getElementById("receiverStatus");

// Handle typing event
input.addEventListener("input", function (value) {
  if (!!input.value) {
    socket.emit("typing", chatId, pubkey);
  } else {
    socket.emit("stop typing", chatId);
  }
});

// Mesaj gönderme işlemi
form.addEventListener("submit", function (e) {
  e.preventDefault(); // Sayfa yenilenmesini engelle
  if (input.value && chatId) {
    const message = input.value;

    // Mesajı ekranında sağda göster (kendi mesajı)
    addMessage(`You: ${message}`, "sent");

    // Mesajı belirli bir chat ID'siyle sunucuya gönder
    socket.emit("send message", { chatId, message });

    input.value = ""; // Mesaj kutusunu temizle

    socket.emit("stop typing", chatId);
  }
});

// Katılım hatası dinleyicisi
socket.on("join error", (message) => {
  console.log(message); // Hata mesajını göster
});

// Çevrimiçi kullanıcı bildirimi
socket.on("user online", (pubkey) => {
  receiverStatus.textContent = `User ${pubkey} is online.`;
});

// Çevrimdışı kullanıcı bildirimi
socket.on("user offline", (pubkey) => {
  receiverStatus.textContent = `User ${pubkey} is offline.`;
});

// Çevrimiçi kullanıcıları göster
socket.on("online users", (onlineUsers) => {
  console.log("Online users:", onlineUsers);
  const receiverPubkey = onlineUsers.find((user) => {
    return user !== pubkey;
  });

  console.log("Receiver pubkey:", receiverPubkey);

  if (receiverPubkey) {
    receiverStatus.textContent = `User ${receiverPubkey} is online.`;
  }
});

// Sunucudan gelen mesajları dinle ve ekranda solda göster (diğer kişinin mesajı)
socket.on("receive message", (message) => {
  addMessage(`Friend: ${message}`, "received");
});

socket.on("user typing", (user) => {
  typingIndicator.textContent = user + " is typing...";
});

socket.on("user stopped typing", () => {
  typingIndicator.textContent = "";
});

// Mesajları chat ekranına ekleyen fonksiyon
function addMessage(message, type) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", type);

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");
  messageContent.textContent = message;

  messageElement.appendChild(messageContent);
  chatDiv.appendChild(messageElement);
  chatDiv.scrollTop = chatDiv.scrollHeight; // Yeni mesajlar görünür kalsın
}

// Modal elementlerini seç
var modal = document.getElementById("modal");
var closeModal = document.getElementById("closeModal");
var joinChatButton = document.getElementById("joinChatButton");
var pubkeyInput = document.getElementById("pubkey");
var chatIdInput = document.getElementById("chatId");

// Chat bilgi elementlerini seç
var publicKeyDisplay = document.getElementById("publicKeyDisplay");
var chatIdDisplay = document.getElementById("chatIdDisplay");

// Modal'ı göster
modal.style.display = "block";

// Modal kapanma butonuna tıklandığında modalı kapat
closeModal.onclick = function () {
  if (pubkey && chatId) {
    modal.style.display = "none";
  } else {
    alert("Please fill in all fields.");
  }
};

// Kullanıcı 'Join Chat' butonuna bastığında
joinChatButton.onclick = function () {
  pubkey = pubkeyInput.value;
  chatId = chatIdInput.value;

  if (pubkey && chatId) {
    // Socket'e katılma talebi gönder
    socket.emit("join chat", chatId, pubkey);

    // Public key ve chat ID bilgilerini göster
    publicKeyDisplay.textContent = `Public Key: ${pubkey}`;
    chatIdDisplay.textContent = `Chat ID: ${chatId}`;

    // Modalı kapat
    modal.style.display = "none";
  } else {
    alert("Please fill in all fields.");
  }
};
