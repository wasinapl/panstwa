import db from "../db";

const Words = {
  async getVotes(req, res) {
    const words = req.body.words;
    const categories = req.body.categories;

    for (let i = 0; i < words.length; i++) {
      const element = words[i];
      for (let j = 0; j < words[i].players.length; j++) {
        const player = words[i].players[j];
        let votes = await getVotes(player.word, categories[i].id);
        player.votes = votes;
      }
    }
    return res.status(200).send(words);
  },
};

async function getVotes(word, cat) {
  const text = `SELECT vote_up, vote_down FROM words.words, words.categories
    WHERE cat_id = words.categories.id AND words.words.word = $1 AND words.categories.id = $2`;
  const { rows } = await db.query(text, [word, cat]);
  if (rows.length < 1) {
    const insert_query = `INSERT INTO words.words(
            word, cat_id, vote_up, vote_down)
            VALUES ($1, $2, 0, 0);`;
    let { rows } = await db.query(insert_query, [word, cat]);
    return { vote_up: 0, vote_down: 0 };
  }
  return rows[0];
}

export default Words;
