// import http from "http";
import express from "express";
import * as socketio from "socket.io";
import * as path from "path";
import Database from './database';
import config from "./config";
import MessageService from "./service";

const app: express.Application = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

// connect to database
Database.connect().then(() => console.log('Connected to database'))
    .catch(err => console.log('Could not connect to database. ' + err.stack ));

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// run when a client connects
io.on("connection", (socket: socketio.Socket) => {
  console.log("New WS connection...");
  socket.emit("message", { message: "welcome to the chat", username: "chat" });

  socket.on("new_user", (data) => {
    console.log(`${data.username} joined the chat`);
    io.sockets.emit("new_user_join", { username: data.username })
  });
  socket.on('message', async (data) => {
      console.log(data);
      try {
          await MessageService.createMessage(data.username, data.message);
      } catch (err) {
          console.log(err);
      }
      io.sockets.emit("message", data);
  });

  socket.on("user_typing", (data) => {
      socket.broadcast.emit('user_typing', { username: data.username });
  });
});

const PORT = config.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
