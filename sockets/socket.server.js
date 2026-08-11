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
      console.log(eventId)
      socket.join(`event_${eventId}`);
    });

    socket.on("send_event_message", (data) => {

      //debugging
      console.log("Recieved send_event_message:", data)
      console.log("Emmiting to room", `event_${data.event_id}`)

      io.to(`event_${data.event_id}`).emit("receive_event_message", {
        userId: data.user_id,
        message: data.content,
        timestamp: new Date(),
      });

      console.log("Emitted to room")
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
