const { Pool } = require('pg');

let pool;

function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL non configurata');
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost')
        ? false
        : { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
      max: 2,
    });
  }
  return pool;
}

async function query(text, params) {
  return getPool().query(text, params);
}

module.exports = { query, getPool };
