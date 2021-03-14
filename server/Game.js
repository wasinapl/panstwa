const Player = require("./Player.js");
const Round = require("./Round.js");
const Axios = require("axios");
var latinize = require("latinize");

module.exports = class Game {
  constructor(io, socket, id, name) {
    this.io = io;
    this.admin = socket.id;
    this.id = id;
    this.name = name;
    this.players = [];
    this.options = {};
    this.options.rounds = 5;
    this.options.categories = [];
    this.options.players = 5;
    this.rounds = [];
    this.round = 0;
    this.lobby = true;
    this.usedLetters = [];
    this.letters = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "R",
      "S",
      "T",
      "U",
      "W",
      "Y",
      "Z",
    ];
    socket.join(id);
    socket.emit("joinRoom", id);
  }

  async playerJoin(socket, player) {
    const data = await this.getData();
    let pl = new Player(socket, player, data);
    this.players.push(pl);
    socket.join(this.id);
    var admin = socket.id == this.admin ? true : false;
    socket.emit("waitRoom", {
      options: this.options,
      players: this.players,
      admin,
      playerId: socket.id,
    });
    socket.to(this.id).emit("playerJoin", { player: pl });
  }

  playerLeft(id) {
    let index = this.players.findIndex((p) => p.id == id);
    this.players.splice(index, 1);
    this.io.to(this.id).emit("playerLeft", id);
  }

  categoriesChange(socket, cat) {
    this.options.categories = cat;
    socket.to(this.id).emit("catChange", cat);
  }
  roundsChange(socket, rounds) {
    this.options.rounds = rounds;
    socket.to(this.id).emit("rndChange", rounds);
  }
  playersChange(socket, players) {
    this.options.players = players;
    socket.to(this.id).emit("plyChange", players);
  }
  playerRdy(socket) {
    let index = this.players.findIndex((p) => p.id == socket.id);
    this.players[index].ready = !this.players[index].ready;
    this.io.to(this.id).emit("playerRdy", socket.id);
  }
  startGame() {
    this.round = 0;
    this.lobby = false;
    let letter = this.letters[Math.floor(this.letters.length * Math.random())];
    this.usedLetters.push(letter);
    var round = new Round(letter, this.players, this.options.categories);
    this.rounds.push(round);
    this.io.to(this.id).emit("startGame", {
      round,
      players: this.players,
      categories: this.options.categories,
    });
  }
  nextRound() {
    this.round++;
    if (this.round == this.options.rounds) {
      this.endGame();
      return;
    }
    let letter = this.letters[Math.floor(this.letters.length * Math.random())];
    while (this.usedLetters.includes(letter)) {
      letter = this.letters[Math.floor(this.letters.length * Math.random())];
    }
    var round = new Round(letter, this.players, this.options.categories);
    this.rounds.push(round);
    this.io.to(this.id).emit("nextRound", {
      round,
      players: this.players,
      categories: this.options.categories,
    });
  }

  endGame() {
    const tab = this.players;
    tab.forEach((pl) => (pl.pkt = 0));

    this.rounds.forEach((round) => {
      round.words.forEach((category) => {
        let bonus = 0;
        for (let i = 0; i < category.players.length; i++) {
          if (category.players[i].empty) {
            bonus = 5;
            break;
          }
        }
        
        category.players.forEach((player) => {
          if (player.empty) {
            player.pkt = 0;
            return;
          }
          let word = latinize(player.word.toLowerCase());
          for (let i = 0; i < category.players.length; i++) {
            if(category.players[i].empty) continue;
            if(category.players[i].name == player.name) continue;
            let word2 = latinize(category.players[i].word.toLowerCase())
            if (word2 == word) {
              player.pkt = 5 + bonus;
              tab.find(pl => pl.name == player.name).pkt += 5 + bonus;
              return;
            }
          }
          player.pkt = 10 + bonus;
          tab.find(pl => pl.name == player.name).pkt += 10 + bonus;
        });
      });
    });
    this.io.to(this.id).emit("endGame", {
      tab,
      rounds: this.rounds,
    });
  }

  async addWords(words, socket) {
    this.rounds[this.round].addWords(words, socket);
    if (this.rounds[this.round].count()) {
      const response = await Axios.post(process.env.API + "/words/getvotes", {
        words: this.rounds[this.round].words,
        categories: this.rounds[this.round].categories,
      });
      this.io.to(this.id).emit("voting", response.data);
    }
  }

  vote(vote, socket) {
    const status = this.rounds[this.round].vote(vote, socket);
    vote.status = status;
    this.io.to(this.id).emit("vote", vote);
  }
  voteReady() {
    this.rounds[this.round].voteReady();
    Axios.post(process.env.API + "/words/savevotes", {
      words: this.rounds[this.round].words,
      categories: this.rounds[this.round].categories,
      players: this.players,
    });
    if (this.rounds[this.round].voteCount()) this.nextRound();
  }

  getInfo() {
    const info = {};
    info.name = this.name;
    info.slots = this.players.length + "/" + this.options.players;
    info.id = this.id;
    return info;
  }

  isLobby() {
    return this.lobby;
  }

  getPlayers() {
    return this.players.length;
  }

  async getData() {
    try {
      const response = await Axios.get(process.env.API + "/user/data");
      return response.data.data;
    } catch (error) {
      console.log("error", error);
    }
  }
};
