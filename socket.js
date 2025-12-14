import { Server } from "socket.io";

let io = null;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log('a user connected');

    socket.on('joinUserRoom',(userId) => {
      socket.join(userId);
      console.log(`user joined room ${userId}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`User disconnected. reason: ${reason}`);
    });
  });
}

export function IO(){
  if(!io) throw new Error("IO socket not yet initialized");

  return io;
}