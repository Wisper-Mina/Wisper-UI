const { Server } = require("socket.io");

const setupSocket = (server) => {
  const io = new Server(server);

  const users = {};

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join chat", (chatId, pubkey) => {
      // Kullanıcı sayısını kontrol et
      if (!users[chatId]) {
        users[chatId] = [];
      }
      if (users[chatId].length >= 2) {
        // İki kullanıcıdan fazlası varsa, kullanıcıya hata mesajı gönder
        socket.emit("join error", "Chat is full. Only two users are allowed.");
        return;
      }

      users[chatId].push({ socketId: socket.id, pubkey });
      socket.join(chatId); // Kullanıcıyı belirli bir chat ID'sine katılmasını sağla
      console.log(`User ${pubkey} joined chat: ${chatId}`);

      //   socket.to(chatId).emit("user online", pubkey);
      // Diğer kullanıcılara çevrimiçi bilgisi gönder
      socket.to(chatId).emit("user online", pubkey); // Diğer kullanıcılara online bilgisi gönder
      // Kendisine diğer çevrimiçi kullanıcıları bildir
      const onlineUsers = users[chatId].map((user) => user.pubkey);
      socket.emit("online users", onlineUsers);
    });

    socket.on("send message", async ({ chatId, message }) => {
      console.log("Message received:", message);
      const onlineUsers = users[chatId] || [];

      console.log("Online users:", onlineUsers);

      if (onlineUsers.length > 0) {
        // Eğer çevrimiçi kullanıcı varsa doğrudan ilet
        socket.to(chatId).emit("receive message", message);
      } else {
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      for (const chatId in users) {
        // Ayrılan kullanıcının pubkey'ini bul
        const user = users[chatId].find((user) => user.socketId === socket.id);

        // Eğer kullanıcı bulunduysa, pubkey ile diğer kullanıcılara bildirim gönder
        if (user) {
          users[chatId] = users[chatId].filter((u) => u.socketId !== socket.id);
          socket.to(chatId).emit("user offline", user.pubkey);
        }
      }
    });

    socket.on("typing", (chatId, pubkey) => {
      socket.to(chatId).emit("user typing", pubkey);
    });

    // Yazma durumu sona erdiğinde
    socket.on("stop typing", (chatId) => {
      socket.to(chatId).emit("user stopped typing");
    });
  });

  return io;
};

module.exports = setupSocket;
