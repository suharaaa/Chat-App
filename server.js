const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const activeUsers = [];

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//run when a client connects
io.on("connection", (socket) => {
  console.log("New WS connection...");
  activeUsers.push(socket);

  socket.emit("message", { message: "welcome to the chat", username: "chat" });
  socket.on("new_user", (data) => {
    console.log(`${data.username} joined the chat`);
    activeUsers.forEach((user) =>
      user.emit("new_user_join", { username: data.username })
    );
  });
  socket.on('message', (data) => {
      console.log(data);
      activeUsers.forEach((user) => {
          user.emit("message", data);
      })
  });
  socket.on("user_typing", (data) => {
      activeUsers.forEach((user) => {
          socket.id !== user.id && user.emit("user_typing", { username: data.username });
      });
  })
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
