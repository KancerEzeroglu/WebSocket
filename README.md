# **WebSocket Chat Application**

This is a real-time chat application built using **Node.js**, **Express**, and **WebSocket**. 
It allows multiple clients to connect, send messages, and receive messages from other connected clients in real-time.

## **Features**
- Real-time communication using WebSocket.
- Automatically assigns a unique name to each client when they connect.
- Broadcasts messages to all connected clients, including the sender.
- Simple and clean user interface for sending and displaying messages.

---

## **Directory Structure**

```
chat-app/
├── node_modules/        # Installed dependencies
├── public/
│   ├── index.html       # Chat client interface (frontend)
│   ├── chat.js          # JavaScript for handling WebSocket logic
├── server.js            # Chat server (Node.js backend)
├── package.json         # Project metadata and dependencies
└── package-lock.json    # Dependency tree for reproducibility
```

---

## **Getting Started**

### **Prerequisites**
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/)

---

### **Setup**

1. Clone the repository or download the code:
   ```bash
   git clone https://github.com/your-repo/chat-app.git
   cd chat-app
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## **How It Works**

### **Server (Backend)**
- The server listens for WebSocket connections.
- When a client connects:
  - The server assigns a unique name to the client (e.g., `User-a1b2c3`).
  - It broadcasts any messages the client sends to all other connected clients.
- Disconnections are logged, and the client is removed from the active list.

### **Client (Frontend)**
- Each client connects to the server via WebSocket.
- Clients can:
  - Send messages to the server.
  - Receive messages from the server, including the name of the sender.
- The chat messages are displayed in real-time in the chatbox.

---

## **Example Usage**

1. Open multiple tabs or browsers and navigate to `http://localhost:3000`.
2. Each client will be assigned a unique name (e.g., `User-a1b2c3`).
3. Type a message in the input box and click **Send** (or press Enter).
4. Messages will appear in all connected clients' chatboxes.

---

## **Code Highlights**

### **Server Highlights:**
- Generates unique client names using `uuidv4`.
- Handles WebSocket connections and broadcasts messages:
  ```javascript
  wss.on("connection", (ws) => {
      const clientName = generateClientName();
      clients.set(ws, clientName);
      ws.send(JSON.stringify({ type: "welcome", name: clientName }));
  });

  function broadcast(data, senderSocket) {
      wss.clients.forEach((client) => {
          if (client !== senderSocket && client.readyState === client.OPEN) {
              client.send(data);
          }
      });
  }
  ```

### **Client Highlights:**
- Listens for messages and displays them dynamically:
  ```javascript
  socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "welcome") {
          clientName = data.name;
      } else if (data.type === "message") {
          displayMessage(`${data.name}: ${data.content}`);
      }
  };
  ```

---

## **Technologies Used**
- **Node.js**: Backend server.
- **Express**: To serve static files.
- **WebSocket**: For real-time bi-directional communication.
- **uuidv4**: To generate unique client names.

---

## **Possible Enhancements**
- **User Authentication:**
  - Add user login and authentication for secure chat sessions.
- **Chat Rooms:**
  - Allow users to join specific chat rooms instead of broadcasting messages globally.
- **Message History:**
  - Store chat messages in a database (e.g., MongoDB) and display history on reconnect.
- **Typing Indicators:**
  - Show when a user is typing.
- **Media Support:**
  - Add support for sending images, videos, or files.

---

## **Contributing**
Feel free to fork this repository and submit pull requests for improvements or additional features.

---

## **License**
This project is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).

---

## **Contact**
If you have any questions or suggestions, feel free to reach out:
- **Email:** ezeroglukancer@gmail.com
- **GitHub:** [My GitHub Profile](https://github.com/KancerEzeroglu)