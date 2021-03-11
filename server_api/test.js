const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:wrzysztof12@localhost:5432/panstwa'
});

(async () => {
    const { rows } = await pool.query(`SELECT id, name FROM users."user";`);
    console.log(rows);
})();