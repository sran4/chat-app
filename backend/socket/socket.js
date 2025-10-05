import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000", // Development
      "https://chat-app.vercel.app", // Production Vercel
      "https://chat-app-git-main.vercel.app", // Vercel preview
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    console.log("User mapped:", userId, "->", socket.id);

    // Send updated online users list to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // socket.on() is used to listen to the events. can be used both on client and server side
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // Listen for unread count updates
  socket.on("requestUnreadCounts", async (userId) => {
    // This will be handled by the frontend to fetch unread counts
    // The actual unread counts will be sent via the API endpoint
  });
});

export { app, io, server };
