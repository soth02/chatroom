// chatroom.js

// Get references to HTML elements
const messageInput = document.getElementById("messageInput");
const messageList = document.getElementById("messageList");
const connectButton = document.getElementById("connectButton");

// Generate a random ID for the user
const userId = Math.random().toString(36).substring(7);

// Create a new PeerJS object with a random ID and the host of the signaling server
const peer = new Peer(userId, {
  host: "localhost",
  port: 9000,
  path: "/myapp",
});

// Listen for connections from other peers
peer.on("connection", (connection) => {
  // Handle incoming data messages from the peer
  connection.on("data", (data) => {
    const messageItem = document.createElement("li");
    messageItem.innerText = data;
    messageList.appendChild(messageItem);
  });
});

// Connect to another peer when the "Connect" button is clicked
connectButton.addEventListener("click", () => {
  // Get the ID of the peer to connect to
  const remoteId = prompt("Enter the ID of the remote peer:");

  // Create a new data connection to the remote peer
  const connection = peer.connect(remoteId);

  // Handle errors and close events for the data connection
  connection.on("error", (error) => {
    console.error(error);
  });
  connection.on("close", () => {
    console.log("Connection closed");
  });

  // Handle input from the user and send it to the remote peer
  messageInput.addEventListener("keypress", (event) => {
    if (event.keyCode === 13) {
      const message = messageInput.value;
      messageInput.value = "";
      connection.send(message);

      const messageItem = document.createElement("li");
      messageItem.innerText = "Me: " + message;
      messageList.appendChild(messageItem);
    }
  });
});
