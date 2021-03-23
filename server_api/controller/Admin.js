
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

  async update(req, res){
    const user = req.body.user;

    const query = `UPDATE users."user"
    SET username=$1, email=$2, role=$3
    WHERE id=$4;`;
    try {
      const { rows } = await db.query(query, [user.username, user.email, user.role, user.id]);
      return res.status(200).send();
    } catch (error) {
      console.log(error)
      return res.status(400).send(error);
    }
  },

  async ban(req, res){
    const id = req.body.id;

    let query = `INSERT INTO users.bans(
      user_id)
      VALUES ($1);`;
    try {
      await db.query(query, [id]);
    } catch (error) {
      console.log(error)
      return res.status(400).send(error);
    }

    let words = [];
    query = `SELECT id, user_id, word_id, good, rate
    FROM words.votes WHERE user_id = $1;`;
    try {
      let response = await db.query(query, [id]);
      words = response.rows;
    } catch (error) {
      console.log(error)
      return res.status(400).send(error);
    }


    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      await removeRate(word.id, word.good, word.rate);
    }

    query = `DELETE FROM words.votes
    WHERE user_id = $1;`;
    try {
      let response = await db.query(query, [id]);
    } catch (error) {
      console.log(error)
      return res.status(400).send(error);
    }

    return res.status(200).send({message: "Pomyślnie zbanowano gracza."});
  },

  async unban(req, res){
    const id = req.body.id;

    const query = `DELETE FROM users.bans
    WHERE user_id = $1;`;
    try {
      let response = await db.query(query, [id]);
      return res.status(200).send({message: "Pomyślnie odbanowano gracza."});
    } catch (error) {
      console.log(error)
      return res.status(400).send(error);
    }
  },

  async getInfo(req, res) {
    const id = req.body.id;
    let query = `SELECT u.id, username, email, role, r.name AS role_name
	FROM users."user" AS  u , users.roles AS r
	WHERE u.role = r.id AND u.id=$1`;
    let user = {};
    try {
      const { rows } = await db.query(query, [id]);
      user = rows[0];
      user.role = Number(user.role)
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

    let messages = [];
    query = `SELECT id, message
    FROM game.chat WHERE user_id = $1;`;
      try {
        const { rows } = await db.query(query, [id]);
        messages = rows;
      } catch (error) {
          console.log(error.message)
        return res.status(400).send(error);
      }

    let banned = false;
    query = `SELECT id, user_id
    FROM users.bans WHERE user_id = $1;`;
    try {
      const { rows } = await db.query(query, [id]);
      if(rows[0]) banned = true;
    } catch (error) {
        console.log(error.message)
      return res.status(400).send(error);
    }

    return res.status(200).send({user, games, words, votes, messages, banned});
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

async function removeRate(word_id, good, val){
  let query = '';
  if(good){
    query = `UPDATE words.words
    SET vote_up= vote_up - $2
    WHERE id = $1;`
  }else{
    query = `UPDATE words.words
    SET vote_down= vote_down - $2
    WHERE id = $1;`
  }

  try {
    const response = await db.query(query, [word_id, val]);
  } catch (error) {
      console.log(error.message)
  }
}

export default Admin;
