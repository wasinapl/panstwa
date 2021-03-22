import db from "../db";

const Statistics = {
  async getStatistics(req, res) {
    let query = `SELECT * FROM game.players WHERE user_id=$1`;
    let games_id = [];
    let points = 0;
    try {
      let response = await db.query(query, [req.user.id]);
      response.rows.forEach((row) => {
        games_id.push(row.game_id);
        points += Number(row.pkt);
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }

    let games = [];

    for (let i = 0; i < games_id.length; i++) {
      const game_id = games_id[i];
      const game = await getGame(game_id, req.user.id);
      games.push(game);
    }

    let letters = {};
    let categories = {};
    let rounds = 0;
    games.forEach((game) => {
      game.categories.forEach((cat) => {
        categories[cat.name] = 0;
      });

      game.rounds.forEach((round) => {
        if (!letters[round.letter]) letters[round.letter] = 0;
        rounds++;
        round.words.forEach((word) => {
          letters[round.letter] += Number(word.points);
          let cat_name = game.categories.find(
            (cat) => cat.id == word.category_id
          ).name;
          categories[cat_name] += Number(word.points);
        });
      });
    });
    let average = Math.round(points / rounds);

    let arr_val = Object.values(letters);
    let arr_keys = Object.keys(letters);
    let max = Math.max(...arr_val);
    let letter = arr_keys[arr_val.findIndex(val => val == max)];

    arr_val = Object.values(categories);
    arr_keys = Object.keys(categories);
    max = Math.max(...arr_val);
    let category = arr_keys[arr_val.findIndex(val => val == max)];

    return res.status(200).send({ games: games_id.length, average, category, letter });
  },
};

async function getGame(id, user_id) {
  let query = `SELECT id, name, admin, rounds
	FROM game.games WHERE id = $1;`;
  let game = {};
  try {
    let response = await db.query(query, [id]);
    game = response.rows[0];
  } catch (error) {
    console.log(error);
  }

  query = `SELECT words.categories.id, words.categories.name
	FROM game.categories, words.categories WHERE game_id = $1 AND category_id = words.categories.id;`;
  try {
    let response = await db.query(query, [game.id]);
    game.categories = response.rows;
  } catch (error) {
    console.log(error);
  }

  query = `SELECT id, game_id, letter
	FROM game.rounds WHERE game_id = $1;`;
  try {
    let response = await db.query(query, [game.id]);
    game.rounds = response.rows;
  } catch (error) {
    console.log(error);
  }

  for (let i = 0; i < game.rounds.length; i++) {
    const round = game.rounds[i];

    query = `SELECT *
	FROM game.words WHERE round_id = $1 AND player_id = $2;`;
    try {
      let response = await db.query(query, [round.id, user_id]);
      round.words = response.rows;
    } catch (error) {
      console.log(error);
    }
  }

  return game;
}

export default Statistics;
