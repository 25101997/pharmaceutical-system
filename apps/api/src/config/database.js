const oracledb = require('oracledb');

let pool;

async function initializeDatabase() {
  pool = await oracledb.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
    poolMin: 1,
    poolMax: 10,
    poolIncrement: 1
  });

  console.log('Oracle connection pool initialized');
}

async function getConnection() {
  if (!pool) {
    throw new Error('Database pool is not initialized');
  }
  return pool.getConnection();
}

async function closeDatabase() {
  if (pool) {
    await pool.close(10);
    pool = undefined;
  }
}

module.exports = { initializeDatabase, getConnection, closeDatabase };
