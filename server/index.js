const express = require("express");
const app = express();
const shortid = require("shortid");
require('dotenv').config()
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
    rooms[roomId] = new Game(io, socket, roomId, data);
  });

  socket.on("roomExist", (name, res) => {
    if(rooms[name] && rooms[name].isLobby())
     res({exist: true, pass: rooms[name].pass, admin: rooms[name].adminCheck(socket.id)})
    else res({exist: false});
  })
  socket.on("roomList", (callback) => {
    const list = [];
    for(key in rooms){
      if(rooms[key].isLobby())
      list.push(rooms[key].getInfo());
    }
    callback(list);
  })

  const emitRoomList = () =>{
    const list = [];
    for(key in rooms){
      if(rooms[key].isLobby())
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
  socket.on("timeChange", time => {
    rooms[socket.room].timeChange(socket, time);
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
  socket.on("vote", vote => {
    rooms[socket.room].vote(vote, socket);
  });
  socket.on("voteReady", () => {
    rooms[socket.room].voteReady();
  });

  socket.on("time", () => {
    io.to(socket.room).emit('time');
  });

  socket.on("msg", (msg) => {
    socket.to(socket.room).emit('msg', {msg, from: socket.id});
  });

  socket.on("kick", id => {
    socket.to(socket.room).emit('kick', id);
  });

  socket.on("home", () => {
    removeFromRoom(socket);
  });
  
  socket.on("disconnect", () => {
    console.info(`Client gone [id=${socket.id}]`);
    removeFromRoom(socket)
  });

  const removeFromRoom = (socket) => {
    if(rooms[socket.room]) {
      rooms[socket.room].playerLeft(socket.id)
      if(rooms[socket.room].getPlayers() == 0) delete rooms[socket.room];
      emitRoomList();
    };
  }
});
