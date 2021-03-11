module.exports = class Round {
  constructor(letter, players, categories) {
    this.letter = letter;
    this.players = players;
    this.categories = categories;
    this.words = [];
    for (let category of this.categories) {
      let cat = {};
      cat.name = category.name;
      cat.players = [];
      this.words.push(cat);
    }
  }

  addWords(words, socket) {
    for (let i = 0; i < words.length; i++) {
      let info = this.players.find((el) => el.id == socket.id);
      let player = {};
      player.icon = info.icon;
      player.color = info.color;
      player.username = info.username;
      if (words[i].length > 1) {
        player.word = words[i];
        player.status = 0;
        player.x = 0;
        player.v = this.players.length;
      } else {
        player.empty = true;
        player.status = 1;
        player.word = "";
        player.x = this.players.length;
        player.v = 0;
      }
      this.words[i].players.push(player);
    }
  }
  count() {
    return (
      this.words[this.words.length - 1].players.length == this.players.length
    );
  }
};
