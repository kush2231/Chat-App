const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const presence = require("./config/presenceStore");
const path = require("path");
const cors = require("cors");

// dotenv.config();
require('dotenv').config(); 
connectDB();
const app = express();
app.use(cors());

app.use(express.json()); // to accept json data

app.get("/", (req, res) => {
  res.send("API Running!");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const server = app.listen(
  PORT,
  console.log(`Server running on http://localhost:${PORT}...`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONT_URL, // frontend port
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", async (userData) => {
    socket.join(userData._id);

    // Track presence in Redis (or in-memory fallback)
    await presence.setOnline(userData._id, socket.id);

    // Send this user the current list of online users
    const onlineIds = await presence.getAllOnlineIds();
    socket.emit("online-users", onlineIds);

    // Notify everyone else that this user came online
    socket.broadcast.emit("user-online", userData._id);

    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("leave chat", (room) => {
    socket.leave(room);
    socket.to(room).emit("user left", socket.id);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("disconnect", async () => {
    const userId = await presence.getUserIdBySocket(socket.id);
    if (userId) {
      await presence.setOffline(userId, socket.id);
      // Notify everyone this user went offline
      socket.broadcast.emit("user-offline", userId);
      console.log(`User ${userId} disconnected`);
    }
  });
});
