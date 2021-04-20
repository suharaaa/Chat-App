// import http from "http";
import express from "express";
import * as socketio from "socket.io";
import * as path from "path";
import Database from "./database";
import config from "./config";
import MessageService from "./service";
import Router from "./router";
import bodyParser from "body-parser";
import { IStroke } from "./model";

const app: express.Application = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(bodyParser.json());

// connect to database
Database.connect()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log("Could not connect to database. " + err.stack));

// set static folder
app.use(express.static(path.join(__dirname, "public")));

app.use(Router);

// run when a client connects
io.on("connection", (socket: any) => {
  console.log("New WS connection...");
  const roomId = socket.handshake.query.id;
  console.log(roomId);
  socket.join(roomId);

  socket.emit("message", {
    message: "welcome to the chat",
    username: "chat",
  });

  // runs when a user join
  socket.on("new_user", async (data: any) => {
    console.log(`${data.username} joined the chat`);
    socket.broadcast.to(roomId).emit("new_user_join", { username: data.username });
    if (data.userType === "tutor") {
      try {
        await MessageService.setJoinedTutor(roomId, data.username, new Date());
      } catch (err) {
        console.log(err);
      }
    }
  });

  socket.on("tutor_leave", async (data: any) => {
    io.to(roomId).emit("tutor_leave", data);
    try {
      await MessageService.setJoinedTutor(roomId, '', new Date());
      await MessageService.addJoinedTutor(roomId, data.username);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("end_session", (data: any) => {
    io.to(roomId).emit("end_session", data);
  });

  socket.on("message", async (data: any) => {
    console.log(data);
    try {
      await MessageService.createMessage(roomId, data.username, data.message, data.userID, data.userType);
    } catch (err) {
      console.log(err);
    }
    io.to(roomId).emit("message", data);
  });

  socket.on("user_typing", (data: any) => {
    socket.broadcast.to(roomId).emit("user_typing", { username: data.username });
  });

  socket.on('draw', (data: IStroke) => {
    console.log(data);
    socket.broadcast.emit('draw', data);
    MessageService.addStroke( roomId, data.prevX, data.prevY, data.currX, data.currY, data.strokeStyle, data.lineWidth);
  });
});

const PORT = config.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
