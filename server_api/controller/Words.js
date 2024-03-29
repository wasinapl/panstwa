import db from "../db";
import latinize from "latinize";

const Words = {
  async getVotes(req, res) {
    const words = req.body.words;
    const categories = req.body.categories;

    for (let i = 0; i < words.length; i++) {
      const category = words[i];
      const cat_id = categories.find(cat => cat.name == category.name).id;
      for (let j = 0; j < category.players.length; j++) {
        const player = category.players[j];
        if(!player.empty){
          
          let votes = await getVotes(player.word, cat_id);
          player.votes = votes;
        }
      }
    }
    return res.status(200).send(words);
  },

  async saveVotes(req, res) {
    const words = req.body.words;
    const categories = req.body.categories;
    const players = [];
    for (let i = 0; i < req.body.players.length; i++) {
      const element = req.body.players[i];
      const pl = await getPlayerVote(element.uuid);
      players.push(pl);
    }
  
    for (let i = 0; i < words.length; i++) {
      const category = words[i];
      const cat_id = categories.find(cat => cat.name == category.name).id;
      for (let j = 0; j < category.players.length; j++) {
        const player = category.players[j];
        for (let k = 0; k < player.v_list.length; k++) {
          const element = player.v_list[k];
          const rating = players.find((el) => el.id == element).rating;
          await addVote(player.word, cat_id, rating * 10, true, element);
        }
  
        for (let k = 0; k < player.x_list.length; k++) {
          const element = player.x_list[k];
          const rating = players.find((el) => el.id == element).rating;
          await addVote(player.word, cat_id, rating * 10, false, element);
        }
      }
    }
    return res.status(200).send();
  }
};

async function getVotes(word, cat) {
  const word_l = latinize(word.toLowerCase());
  const text = `SELECT vote_up, vote_down FROM words.words, words.categories
    WHERE cat_id = words.categories.id AND words.words.word = $1 AND words.categories.id = $2`;
  const { rows } = await db.query(text, [word_l, cat]);
  if (rows.length < 1) {
    const insert_query = `INSERT INTO words.words(
            word, cat_id, vote_up, vote_down)
            VALUES ($1, $2, 0, 0);`;
    let { rows } = await db.query(insert_query, [word_l, cat]);
    return { vote_up: 0, vote_down: 0 };
  }
  return {vote_up: Number(rows[0].vote_up), vote_down: Number(rows[0].vote_down)};
}

async function getPlayerVote(player) {
  const query = `SELECT user_id, vote_up, vote_down FROM users.votes_count WHERE user_id= $1;`;
  const { rows } = await db.query(query, [player]);
  if (rows[0].vote_up + rows[0].vote_down < 10)
    return { id: player, rating: 0.5 };
  if (rows[0].vote_up == 0 && rows[0].vote_down != 0)
    return { id: player, rating: 0.1 };
  if (rows[0].vote_down == 0 && rows[0].vote_up != 0)
    return { id: player, rating: 1 };
  const rating =
    Math.round(((rows[0].vote_up + rows[0].vote_down) / rows[0].vote_up) * 10) /
    10;
  return { id: player, rating };
}

async function addVote(word, category, rating, good, user_id) {
  const word_l = latinize(word.toLowerCase());
  let query = "";
  if (good)
    query = `UPDATE words.words SET vote_up=vote_up + $3 WHERE word=$1 AND cat_id=$2 returning *;`;
  else
    query = `UPDATE words.words SET vote_down= vote_down + $3 WHERE word=$1 AND cat_id=$2 returning *;`;
  const { rows } = await db.query(query, [word_l, category, rating]);
  if (good)
  query = `INSERT INTO words.votes(
    user_id, word_id, good, rate)
    VALUES ($1, $2, true, $3);`
  else
  query = `INSERT INTO words.votes(
    user_id, word_id, good, rate)
    VALUES ($1, $2, false, $3);`
  
  await db.query(query, [user_id, rows[0].id, rating]);
}


export default Words;
