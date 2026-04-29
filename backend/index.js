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
const allowedOrigins = [
  "http://localhost:5173",
  "https://chatterboxweb.netlify.app",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    // In production, we want to know if the URI is the fallback or the intended one
    if (MONGO_URI.includes("localhost") && process.env.NODE_ENV === "production") {
      console.error("CRITICAL: Backend is running in production but using localhost MongoDB URI!");
    }
  });

// Routes
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({ 
    status: "ok", 
    database: dbStatus,
    uptime: process.uptime() 
  });
});

// Fetch message history
app.get("/api/messages", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      error: "Database connection not established",
      details: "The server is unable to connect to MongoDB. Check MONGO_URI environment variable."
    });
  }

  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(50);
    res.json(messages.reverse());
  } catch (error) {
    console.error("Error fetching messages:", error);
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
