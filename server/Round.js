module.exports = class Round {
  constructor(letter, players, categories) {
    this.letter = letter;
    this.players = players;
    this.categories = categories;
    this.words = [];
    this.voteReadyCount = 0;
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
        player.x_list = [];
        player.v_list = this.players.map((el) => el.uuid);
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

  vote(vote, socket) {
    const id = this.players.find((el) => el.id == socket.id).uuid;
    if (vote.status == 0) {
      this.words[vote.cat].players[vote.ply].x--;
      this.words[vote.cat].players[vote.ply].v++;
      this.words[vote.cat].players[vote.ply].v_list.push(id);
      this.words[vote.cat].players[vote.ply].x_list = this.words[
        vote.cat
      ].players[vote.ply].x_list.filter((el) => el != id);
    } else {
      this.words[vote.cat].players[vote.ply].x++;
      this.words[vote.cat].players[vote.ply].v--;
      this.words[vote.cat].players[vote.ply].x_list.push(id);
      this.words[vote.cat].players[vote.ply].v_list = this.words[
        vote.cat
      ].players[vote.ply].v_list.filter((el) => el != id);
    }
    return {
      x: this.words[vote.cat].players[vote.ply].x,
      v: this.words[vote.cat].players[vote.ply].v,
    };
  }

  voteReady(){
    this.voteReadyCount++;
  }

  voteCount(){
    if(this.voteReadyCount == this.players.length) return true;
    return false;
  }

  count() {
    return (
      this.words[this.words.length - 1].players.length == this.players.length
    );
  }
};
