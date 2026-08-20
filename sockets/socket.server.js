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

      // Broadcast the saved message using the same shape returned by the REST API.
      io.to(`event_${data.event_id}`).emit("receive_event_message", {
        id: data.id,
        event_id: data.event_id,
        sender: data.sender,
        user_id: data.user_id,
        content: data.content,
        createdAt: data.createdAt,
      });

      console.log("Emitted to room")
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
