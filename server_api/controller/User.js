import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import db from "../db";
import Helper from "./Helper";

const User = {
  async create(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: "Some values are missing" });
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res
        .status(400)
        .send({ message: "Please enter a valid email address" });
    }
    const text = 'SELECT * FROM users."user" WHERE email = $1';
    try {
      const { rows } = await db.query(text, [req.body.email]);
      if (rows[0]) {
        return res.status(400).send({ message: "Podany email już istnieje" });
      }
    } catch (error) {
      return res.status(400).send(error);
    }

    const hashPassword = Helper.hashPassword(req.body.password);

    const createQuery = `INSERT INTO
    users."user"(id, email,username, password)
      VALUES($1, $2, $3, $4)
      returning *`;
    const values = [uuidv4(), req.body.email, req.body.username, hashPassword];
    try {
      const { rows } = await db.query(createQuery, values);
      const token = Helper.generateToken(rows[0].id);

      try {
        let query = `INSERT INTO users.avatars(
          user_id, color_id, icon_id)
          VALUES ($1, 1, 1)`;
        let values = [rows[0].id];
        await db.query(query, values);
      } catch (error) {
        return res.status(400).send(error);
      }

      try {
        let query = `INSERT INTO users.votes(
          id_user, vote_up, vote_down)
          VALUES ($1, 0, 0)`;
        await db.query(query, [rows[0].id]);
      } catch (error) {
        return res.status(400).send(error);
      }

      return res
        .status(200)
        .send({ token, username: rows[0].username, email: rows[0].email, uuid: rows[0].id  });
    } catch (error) {
      if (error.routine === "_bt_check_unique") {
        return res
          .status(400)
          .send({ message: "User with that EMAIL already exist" });
      }
      return res.status(400).send(error);
    }
  },

  async login(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: "Some values are missing" });
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res
        .status(400)
        .send({ message: "Proszę podać poprawy adres e-mail" });
    }
    const text = 'SELECT * FROM "users"."user" WHERE email = $1';
    try {
      const { rows } = await db.query(text, [req.body.email]);
      if (!rows[0]) {
        return res.status(400).send({ message: "Podany email nie istnieje" });
      }
      if (!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.status(400).send({ message: "Podano złe hasło" });
      }
      const token = Helper.generateToken(rows[0].id);
      return res
        .status(200)
        .send({ token, username: rows[0].username, email: rows[0].email, uuid: rows[0].id });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async loginG(req, res) {
    const text = 'SELECT * FROM "users"."user" WHERE email = $1';
    try {
      const { rows } = await db.query(text, [req.body.email]);
      if (!rows[0]) {
        const hashPassword = Helper.hashPassword('');

        const createQuery = `INSERT INTO
    users."user"(id, email,username, password)
      VALUES($1, $2, $3, $4)
      returning *`;
        const values = [
          uuidv4(),
          req.body.email,
          req.body.name,
          hashPassword,
        ];
        try {
          let { rows } = await db.query(createQuery, values);
          const token = Helper.generateToken(rows[0].id);

          try {
            let query = `INSERT INTO users.avatars(
          user_id, color_id, icon_id)
          VALUES ($1, 1, 1)`;
            let values = [rows[0].id];
            await db.query(query, values);
          } catch (error) {
            return res.status(400).send(error);
          }

          try {
            let query = `INSERT INTO users.votes(
              id_user, vote_up, vote_down)
              VALUES ($1, 0, 0)`;
            await db.query(query, [rows[0].id]);
          } catch (error) {
            return res.status(400).send(error);
          }

          return res
            .status(200)
            .send({ token, username: rows[0].username, email: rows[0].email, uuid: rows[0].id  });
        } catch (error) {
          return res.status(400).send(error);
        }
      }
      const token = Helper.generateToken(rows[0].id);
      return res
        .status(200)
        .send({ token, username: rows[0].username, email: rows[0].email, uuid: rows[0].id  });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async delete(req, res) {
    const deleteQuery = 'DELETE FROM "Users"."User" WHERE id=$1 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.user.id]);
      if (!rows[0]) {
        return res.status(404).send({ message: "user not found" });
      }
      return res.status(204).send({ message: "deleted" });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async getInfo(req, res) {
    const user = {};
    try {
      let { rows } = await db.query("SELECT * FROM users.user WHERE id=$1", [
        req.user.id,
      ]);
      user.username = rows[0].username;
      user.uuid = rows[0].id;
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }

    try {
      let {
        rows,
      } = await db.query("SELECT * FROM users.avatars WHERE user_id=$1", [
        req.user.id,
      ]);
      user.icon = rows[0].icon_id;
      user.color = rows[0].color_id;
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }

    return res.status(200).send({ user });
  },

  async getData(req, res) {
    const data = {};
    data.icons = [];
    data.colors = [];
    try {
      let response = await db.query(
        "SELECT * FROM users.colors ORDER BY id ASC "
      );
      data.colors = response.rows.map((el) => el.name);

      response = await db.query("SELECT * FROM users.icons ORDER BY id ASC ");
      data.icons = response.rows.map((el) => el.name);
    } catch (error) {
      return res.status(400).send(error);
    }

    return res.status(200).send({ data });
  },

  async setInfo(req, res) {
    try {
      let response = await db.query(
        "UPDATE users.avatars SET color_id=$1, icon_id=$2 WHERE user_id = $3",
        [req.body.color, req.body.icon, req.user.id]
      );

      response = await db.query(
        `UPDATE users."user" SET username=$1 WHERE id=$2`,
        [req.body.username, req.user.id]
      );
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
    return res.status(200).send({ message: "Pomyślnie zmieniono dane" });
  },
};

export default User;
