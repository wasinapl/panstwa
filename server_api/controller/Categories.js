import db from "../db";

const Categories = {
  async getAll(req, res) {
    const text = "SELECT * FROM words.categories;";
    try {
      const { rows } = await db.query(text);
      return res.status(200).send(rows);
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};

export default Categories;
