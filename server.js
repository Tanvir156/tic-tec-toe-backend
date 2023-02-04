const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("server is running");
});
const server = app.listen(5000, console.log("server is running at port 5000"));
const io = require("socket.io")(server, {
  pingTimeout: 6000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log(`connected to socket id: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log("disconnected socket");
  });
  socket.on("send message", (message) => {
    console.log(`send message: ${message}`);
    io.emit("received message", message);
  });
  //room features
  socket.on("join room", (roomid) => {
    console.log(`join room: ${roomid}`);
    if (roomid === "") {
      console.log("enter a room id");
    } else {
      socket.join(roomid);
    }
  });
  //send and receive private messages
  socket.on("send privateMessage", ({ message, roomid, name }) => {
    io.to(roomid).emit("received privateMessage", name, message);
  });
  socket.on("game board", ({ roomid, ticTacToe, turn }) => {
    io.to(roomid).emit("new game board", ticTacToe, turn);
  });
});
