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
  socket.on("newGame", (name) => {
    let roomId = shortid.generate();
    rooms[roomId] = new Game(io, socket, roomId, name);
  });

  socket.on("roomExist", name => {
    if(rooms[name]) socket.emit('roomExist', true);
    else socket.emit('roomExist', false);
  })
  socket.on("roomList", (callback) => {
    const list = [];
    for(key in rooms){
      list.push(rooms[key].getInfo());
    }
    callback(list);
  })

  const emitRoomList = () =>{
    const list = [];
    for(key in rooms){
      list.push(rooms[key].getInfo());
    }
    io.emit('roomList', list)
  }

  socket.on("playerJoin", ({id, player}) => {
    rooms[id].playerJoin(socket, player);
    socket.room = id;
    emitRoomList();
  })
  socket.on("catChange", cat => {
    rooms[socket.room].categoriesChange(socket, cat);
  });
  socket.on("rndChange", rounds => {
    rooms[socket.room].roundsChange(socket, rounds);
  });
  socket.on("plyChange", players => {
    rooms[socket.room].playersChange(socket, players);
    emitRoomList();
  });
  socket.on("playerRdy", () => {
    rooms[socket.room].playerRdy(socket);
  });
  socket.on("startGame", () => {
    rooms[socket.room].startGame();
  });
  socket.on("stateChange", data => {
    socket.to(socket.room).emit('stateChange', {data, from: socket.id});
  });
  socket.on("words", words => {
    rooms[socket.room].addWords(words, socket);
  });

  socket.on("time", () => {
    io.to(socket.room).emit('time');
  });

  socket.on("msg", (msg) => {
    socket.to(socket.room).emit('msg', {msg, from: socket.id});
  });
  
  socket.on("disconnect", () => {
    console.info(`Client gone [id=${socket.id}]`);
    if(rooms[socket.room]) {
      rooms[socket.room].playerLeft(socket.id)
      if(rooms[socket.room].getPlayers() == 0) delete rooms[socket.room];
      emitRoomList();
    };
  });
});
