require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const itemRoutes = require("./routes/itemRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://lostapp-wheat.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

// Store userId -> socketId mapping
const userSockets = {};

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // User registers their userId
  socket.on("register", (userId) => {
    userSockets[userId] = socket.id;
    console.log(`✅ User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    Object.keys(userSockets).forEach((key) => {
      if (userSockets[key] === socket.id) delete userSockets[key];
    });
    console.log("❌ User disconnected:", socket.id);
  });
});

app.set("io", io);
app.set("userSockets", userSockets);

app.use(cors({
  origin: ["https://lostapp-wheat.vercel.app", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

server.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});