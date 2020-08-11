const express = require("express");
const app = express();
const shortid = require("shortid");
const Game = require("./Game");

const server = app.listen(3000, function () {
  console.log("server running on port 3000");
});
const io = require("socket.io")(server);

const rooms = [];

io.on("connection", (socket) => {
  console.info(`Client connected [id=${socket.id}]`);
  // initialize this client's sequence number
  socket.on("newGame", (data) => {
    let roomId = shortid.generate();
    rooms[roomId] = new Game(io, socket, roomId);
  });

  socket.on("roomExist", name => {
    if(rooms[name]) socket.emit('roomExist', true);
    else socket.emit('roomExist', false);
  })
  socket.on("playerJoin", ({name, player}) => {
    rooms[name].playerJoin(socket, player);
    socket.room = name;
  })
  socket.on("catChange", cat => {
    rooms[socket.room].categoriesChange(socket, cat);
  });
  socket.on("rndChange", rounds => {
    rooms[socket.room].roundsChange(socket, rounds);
  });
  socket.on("playerRdy", () => {
    rooms[socket.room].playerRdy(socket);
  });
  socket.on("startGame", () => {
    rooms[socket.room].startGame();
  });

  
  socket.on("disconnect", () => {
    console.info(`Client gone [id=${socket.id}]`);
    if(rooms[socket.room]) rooms[socket.room].playerLeft(socket.id);
  });
});
