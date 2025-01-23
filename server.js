const express = require("express");
const { WebSocketServer } = require("ws");
const {v4: uuidv4} = require('uuid')


const app = express()
const PORT = 3000

app.use(express.static('public'))

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({server})

const clients = new Map()

function generateClientName() {
  return `User-${uuidv4().split('-')[0]}`
}

function broadcast(data, senderSocket) {
  wss.clients.forEach((client) => {
      if(client !== senderSocket && client.readyState === client.OPEN){
        client.send(data)
      }
    })
}

wss.on('connection', (ws) => {
  const clientName = generateClientName()
  clients.set(ws, clientName)
  console.log(`${clientName} connected`)

  ws.send(JSON.stringify({type: 'welcome', name: clientName}))

  ws.on('message', (message) => {
    const senderName = clients.get(ws)
    const broadcastMessage = JSON.stringify({
      type: 'message',
      name: senderName,
      content: message.toString()
    })
    broadcast(broadcastMessage, ws) }) //Broadcast to all other clients

  ws.on('close', () => {
    console.log('Client disconnected')
    clients.delete(ws)
  })
})

/* const messageData = {
      content: message.toString(),
      timestamp: new Date().toISOString()
    }
    broadcast(JSON.stringify(messageData), ws) */