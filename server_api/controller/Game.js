import db from "../db";
import latinize from "latinize";

const Game = {
  async save(req, res) {
    const admin = req.body.admin;
    const options = req.body.options;
    const players = req.body.players;
    const rounds = req.body.rounds;
    const name = req.body.name;
    let game_id = 0;

    let query = `INSERT INTO game.games(name, admin, rounds) VALUES ($1, $2, $3) returning *`;
    try {
      let { rows } = await db.query(query, [name, admin, options.rounds]);
      game_id = rows[0].id;
    } catch (error) {
        console.log(error)
      return res.status(400).send(error);
    }

    for (let i = 0; i < options.categories.length; i++) {
      const cat = options.categories[i];
      await addCategory(game_id, cat.id);
    }

    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      await addPlayer(game_id, player.uuid, player.pkt);
    }

    for (let i = 0; i < rounds.length; i++) {
      const round = rounds[i];
      const round_id = await addRound(game_id, round.letter);

      for (let j = 0; j < round.words.length; j++) {
        const category = round.words[j];
        const cat_id = options.categories.find(
          (cat) => cat.name == category.name
        ).id;
        for (let k = 0; k < category.players.length; k++) {
          const word = category.players[k];
          const word_id = await getWordId(
            latinize(word.word.toLowerCase()),
            cat_id
          );
          await addWord(word_id, round_id, word.pkt, cat_id);
        }
      }
    }
    return res.status(200).send();
  },
};

async function addCategory(game_id, cat_id) {
  let query = `INSERT INTO game.categories(game_id, category_id) VALUES ($1, $2)`;
  try {
    let { rows } = await db.query(query, [game_id, cat_id]);
  } catch (error) {
    console.log(error);
  }
}

async function addPlayer(game_id, player_id, pkt) {
  let query = `INSERT INTO game.players(game_id, user_id, pkt) VALUES ($1, $2, $3)`;
  try {
    let { rows } = await db.query(query, [game_id, player_id, pkt]);
  } catch (error) {
    console.log(error);
  }
}

async function addRound(game_id, letter) {
  let query = `INSERT INTO game.rounds(game_id, letter) VALUES ($1, $2) returning *`;
  try {
    let { rows } = await db.query(query, [game_id, letter]);
    return rows[0].id
  } catch (error) {
    console.log(error);
  }
}

async function addWord(word_id, round_id, points, category_id) {
  let query = `INSERT INTO game.words(word_id, round_id, points, category_id) VALUES ($1, $2, $3, $4)`;
  try {
    let { rows } = await db.query(query, [
      word_id,
      round_id,
      points,
      category_id,
    ]);
  } catch (error) {
    console.log(error);
  }
}

async function getWordId(word, category_id) {
  let query = `SELECT * FROM words.words WHERE word = $1 AND cat_id = $2`;
  try {
    let { rows } = await db.query(query, [word, category_id]);
    return rows[0].id;
  } catch (error) {
    console.log(error);
  }
}

export default Game;
