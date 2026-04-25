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

// Socket setup
const io = new Server(server, {
  cors: {
    origin: ["https://lostapp-wheat.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

// Make io accessible
app.set("io", io);

// Middleware
app.use(cors({
  origin: ["https://lostapp-wheat.vercel.app", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

// Socket connection
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
server.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});