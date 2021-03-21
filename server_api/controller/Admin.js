import db from "../db";

const Admin = {
  async search(req, res) {
    const name = req.body.name;

    const query = `SELECT u.id, username, email, role, r.name AS role_name
	FROM users."user" AS  u , users.roles AS r
	WHERE u.role = r.id AND (position($1 in u.username)>0 OR position($1 in u.email)>0)`;
    try {
      const { rows } = await db.query(query, [name]);
      return res.status(200).send(rows);
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async getInfo(req, res) {
    const id = req.body.id;
    console.log(id)
    let query = `SELECT u.id, username, email, role, r.name AS role_name
	FROM users."user" AS  u , users.roles AS r
	WHERE u.role = r.id AND u.id=$1`;
    let user = {};
    try {
      const { rows } = await db.query(query, [id]);
      user = rows[0];
    } catch (error) {
        console.log(error.message)
      return res.status(400).send(error);
    }

    let games = [];
    query = `SELECT g.id, g.name, g.rounds, p.pkt
	FROM game.players as p, game.games as g
	WHERE user_id = $1
	AND p.game_id = g.id;`;
    try {
      const { rows } = await db.query(query, [id]);
      games = rows;
    } catch (error) {
        console.log(error.message)
      return res.status(400).send(error);
    }

    let words = [];
    query = `SELECT words.words.word
      FROM game.words as w, words.words
      WHERE w.player_id = $1
      AND w.word_id = words.words.id`;

    try {
      const { rows } = await db.query(query, [id]);
      words = rows;
    } catch (error) {
        console.log(error.message)
      return res.status(400).send(error);
    }

    let votes = [];
    query = `SELECT words.words.word, words.votes.good
	FROM words.votes, words.words
	WHERE words.votes.user_id = $1
	AND words.votes.word_id = words.words.id;`;
    try {
      const { rows } = await db.query(query, [id]);
      votes = rows;
    } catch (error) {
        console.log(error.message)
      return res.status(400).send(error);
    }
    return res.status(200).send({user, games, words, votes});
  },

  async getReports(req, res){
      const query = `SELECT id, "from", "to"
      FROM users.reports;`
      let rows = [];
      try {
        const response = await db.query(query);
        rows = response.rows;
      } catch (error) {
          console.log(error.message)
        return res.status(400).send(error);
      }

      for (let i = 0; i < rows.length; i++) {
          rows[i].from = await getUser(rows[i].from);
          rows[i].to = await getUser(rows[i].to);
      }

      return res.status(200).send(rows);
  }
};

async function getUser(id){
    const query = `SELECT id, username, email, password, role
	FROM users."user" WHERE id=$1;`
      let rows = [];
      try {
        const response = await db.query(query, [id]);
        return response.rows[0]
      } catch (error) {
          console.log(error.message)
      }
}

export default Admin;
