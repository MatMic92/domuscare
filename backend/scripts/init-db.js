require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs = require('fs');
const path = require('path');
const { getPool } = require('../src/db');

async function main() {
  const schemaPath = path.join(__dirname, '..', '..', 'db', 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  const pool = getPool();
  await pool.query(sql);
  console.log('Schema applicato con successo.');
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
