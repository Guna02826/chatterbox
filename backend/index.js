const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Message = require("./models/Message");

const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/chatterbox";

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// Fetch message history
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(50);
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle joining
  socket.on("join", (username) => {
    onlineUsers.set(socket.id, username);
    io.emit("userList", Array.from(onlineUsers.values()));
    
    // Notify others
    socket.broadcast.emit("receiveMessage", {
      username: "System",
      message: `${username} has joined the chat`,
      system: true,
    });
  });

  // Handle message sending
  socket.on("sendMessage", async (data) => {
    const { username, message } = data || {};
    
    try {
      const newMessage = new Message({ username, message });
      await newMessage.save();

      io.emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // Handle typing status
  socket.on("typing", (data) => {
    socket.broadcast.emit("userTyping", data);
  });

  // Clean up on disconnect
  socket.on("disconnect", () => {
    const username = onlineUsers.get(socket.id);
    if (username) {
      onlineUsers.delete(socket.id);
      io.emit("userList", Array.from(onlineUsers.values()));
      
      socket.broadcast.emit("receiveMessage", {
        username: "System",
        message: `${username} has left the chat`,
        system: true,
      });
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
