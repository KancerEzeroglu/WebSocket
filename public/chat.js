const socket = new WebSocket('ws://localhost:3000')

const chatBox = document.getElementById("chat");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const outputMessage = document.getElementById("output");

let clientName = ''

function displayMessage(message) {
  const messageElement = document.createElement('p')
  messageElement.textContent = message
  chatBox.appendChild(messageElement)
  chatBox.scrollTop = chatBox.scrollHeight // Auto-scroll to the latest message
}

socket.onopen = () => {
  outputMessage.innerHTML += '<p>Connected to WebSocket server</p>'
}

socket.onmessage = (event) => {
  const data = JSON.parse(event.data)
  if(data.type === 'welcome'){
    clientName = data.name
    displayMessage(`You are known as: ${clientName}`);
  }else if(data.type === 'message'){
    displayMessage(`${data.name}: ${data.content}`)
  }
}

socket.onclose = () => {
  outputMessage.innerHTML += '<p>Disconnected from WebSocket server</p>'
}

function sendMessage(){
  const message = messageInput.value
  if(message.trim()){
    socket.send(message)
    displayMessage(`${clientName}: ${message}`)
    messageInput.value = ''
  }
}

sendButton.addEventListener('click', sendMessage)
messageInput.addEventListener('keypress', (event) => {
  if(event.key === 'Enter'){
    sendMessage()
  }
})