// messageQueue.js
const amqp = require("amqplib");
const config = require("config");
const logger = require("../utils/winstonLogger");

let channel, queue;

const connectRabbitMQ = async () => {
  try {
    console.log("Connecting to RabbitMQ");
    const connection = await amqp.connect(config.get("rabbit.url"));
    channel = await connection.createChannel();
    queue = config.get("rabbit.queue");
    logger.info("Connected to RabbitMQ");
  } catch (error) {
    logger.error("Error connecting to RabbitMQ:", error);
  }
};

const createQueueForUser = async (pubkey) => {
  const chatQueue = `${queue}_${pubkey}`;
  await channel.assertQueue(chatQueue, { durable: true });
  return chatQueue;
};

const sendMessageToUserQueue = async (chatId, receiverPk, message) => {
  if (!channel) {
    console.error("Channel is not defined. Cannot send message.");
    return;
  }

  const chatQueue = await createQueueForUser(receiverPk);
  const msg = JSON.stringify({ chatId, message });

  channel.sendToQueue(chatQueue, Buffer.from(msg), { persistent: true });
  console.log(`Message sent to queue ${chatQueue}: ${msg}`);
};

const receiveMessagesFromUserQueue = async (io, userPk, users) => {
  const chatQueue = await createQueueForUser(userPk);

  channel.consume(
    chatQueue,
    (msg) => {
      if (msg !== null) {
        const { chatId, message } = JSON.parse(msg.content.toString());
        // Çevrimiçi kullanıcıya mesajı ilet
        //TODO: tüm mesajları ilet client ayırsın
        const chatSockets = io.sockets.adapter.rooms.get(chatId);
        if (chatSockets) {
          chatSockets.forEach((socketId) => {
            const socket = io.sockets.sockets.get(socketId);
            const user = users[chatId].find((u) => u.socketId === socketId);
            if (user && user.pubkey === userPk) {
              socket.emit("receive message", message);
              console.log(`Message sent to user ${userPk} in chat ${chatId}`);
            }
          });
        }
        channel.ack(msg);
      }
    },
    { noAck: false }
  );
};

module.exports = {
  connectRabbitMQ,
  sendMessageToUserQueue,
  receiveMessagesFromUserQueue,
};
