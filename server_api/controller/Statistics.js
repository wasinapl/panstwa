import db from "../db";

const Statistics = {
  async getStatistics(req, res) {
    let query = `SELECT * FROM game.players WHERE user_id=$1`;
    let games_id = [];
    let average = 0;
    try {
      let response = await db.query(query, [req.user.id]);
      response.rows.forEach((row) => {
        games_id.push(row.games_id);
      });
      
    } catch (error) {
        console.log(error)
      return res.status(400).send(error);
    }



    return res.status(200).send({games: games_id.length, average});
  },
};

export default Statistics;
