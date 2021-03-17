  
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:wrzysztof12@localhost:5432/panstwa"
});

export default pool