const Player = require('./Player.js');
const Round = require('./Round.js');


module.exports = class Game{
    constructor(io, socket, name){
        this.io = io;
        this.admin = socket.id;
        this.name = name;
        this.players = [];
        this.options = {};
        this.options.rounds = 5;
        this.options.categories = [];
        this.rounds = [];
        this.letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        socket.join(name);
        socket.emit('joinRoom', name);
    }

    playerJoin(socket, player){
        socket.icon = player.icon;
        socket.color = player.color;
        socket.username = player.username;
        let pl = new Player(socket);
        this.players.push(pl);
        socket.join(this.name);
        var admin = (socket.id == this.admin) ? true : false;
        socket.emit('waitRoom', {options: this.options, players: this.players, admin});
        socket.to(this.name).emit('playerJoin', {player: pl});
    }

    playerLeft(id){
        let index = this.players.findIndex(p => p.id == id);
        this.players.splice(index, 1);
        this.io.to(this.name).emit('playerLeft', id);
    }

    categoriesChange(socket, cat){
        this.options.categories = cat;
        socket.to(this.name).emit("catChange", cat);
    }
    roundsChange(socket, rounds){
        this.options.rounds = rounds;
        socket.to(this.name).emit("rndChange", rounds);
    }
    playerRdy(socket){
        let index = this.players.findIndex(p => p.id == socket.id);
        this.players[index].ready = !this.players[index].ready;
        this.io.to(this.name).emit("playerRdy", socket.id);
    }
    startGame(){
        this.actRound = 0;
        let letter = this.letters[Math.floor( this.letters.length * Math.random())];
        var round = new Round(letter, this.players, this.options.categories);
        console.log(round);
        this.rounds.push(round);
        this.io.to(this.name).emit("startGame", {round, players: this.players});
    }
}