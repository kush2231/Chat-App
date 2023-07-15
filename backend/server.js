const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
// const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const { chats } = require("./data/data");
const  cors =require("cors");


dotenv.config();
connectDB();
const app = express();
app.use(cors());

app.use(express.json()); // to accept json data
app.use("/api/user", userRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/message", messageRoutes);
app.get("/",(req, res)=> {
  res.send("API is running");
})


  app.use(notFound);
  app.use(errorHandler);
  
  
  const PORT = process.env.PORT;
  
  const server = app.listen(
    PORT,
  console.log(`Server running on PORT  ${PORT}`.yellow.bold)
);