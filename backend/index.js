const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

let users = {};

io.on("connection", (socket) => {
  // Save username when set
  socket.on("setUsername", (username) => {
    users[socket.id] = username;
  });

  // Handle message sending
  socket.on("sendMessage", (data) => {
    const { username, message } = data || {};
    const storedUsername = users[socket.id] || username || "Anonymous";

    io.emit("receiveMessage", {
      username: storedUsername,
      message,
    });
  });

  // Clean up on disconnect
  socket.on("disconnect", () => {
    delete users[socket.id];
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

