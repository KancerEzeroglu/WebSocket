const express = require("express");
const { WebSocketServer } = require("ws");
const {v4: uuidv4} = require('uuid')
const {Kafka, Partitioners} = require('kafkajs')
require('dotenv').config()


const app = express()
const PORT = process.env.PORT || 3000
console.log('PORT: ', PORT)

//KAFKA

const kafka = new Kafka({brokers: ['localhost:9092']})
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner
})

const consumer = kafka.consumer({ groupId: "chat-group" });

(async () => {
  try {
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({ topic: "chat-messages", fromBeginning: true });

    // Start consuming messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = JSON.parse(message.value.toString());
        console.log(`Received from Kafka: ${JSON.stringify(data)}`);
        broadcast(data, null); // Pass null as the senderSocket
      },
    });
  } catch (err) {
    console.error("Error with Kafka:", err);
  }
})();

// END KAFKA

app.use(express.static('public'))

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({server})

const clients = new Map()

function generateClientName() {
  return `User-${uuidv4().split('-')[0]}`
}

function broadcast(message, senderSocket) {
  clients.forEach((_, client) => {
      if(client !== senderSocket && client.readyState === client.OPEN){
        client.send(message)
      }
    })
}

wss.on('connection', (ws) => {
  const clientName = generateClientName()
  clients.set(ws, clientName)
  console.log(`${clientName} connected`)

  ws.send(JSON.stringify({type: 'welcome', name: clientName}))

  ws.on('message', async (message) => {
    const senderName = clients.get(ws)
    const broadcastMessage = JSON.stringify({
      type: 'message',
      name: senderName,
      content: message.toString()
    })
try{
    await producer.send({
      topic: 'chat-messages',
      messages: [{ value: broadcastMessage}]
    })
  }catch(err){
    console.error("Error sending message to Kafka:", err);
  }

  //  broadcast(broadcastMessage, ws) 
  }) //Broadcast to all other clients

  ws.on('close', () => {
    clients.delete(ws)
    console.log('Client disconnected')
  })
})
