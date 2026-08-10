const { Server, Socket } = require("socket.io");

const Url = process.env.FRONTEND_URL || "http://localhost:5173";

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: Url,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User conncted: ${socket.id}`);

    socket.on("join_event", (eventId) => {
      socket.join(`event_${eventId}`);
    });

    socket.on("send_event_message", (data) => {
      io.to(`event_${data.eventId}`).emit("receive_event_message", {
        userId: data.userId,
        message: data.message,
        timestamp: new Date(),
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
