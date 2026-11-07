const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [oracledb.CLOB];

let pool;

async function initializeDatabase() {
  if (pool) return pool;
  pool = await oracledb.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
    poolMin: Number(process.env.DB_POOL_MIN || 1),
    poolMax: Number(process.env.DB_POOL_MAX || 10),
    poolIncrement: 1
  });
  return pool;
}

async function getConnection() {
  return oracledb.getConnection();
}

async function closeDatabase() {
  if (pool) {
    await pool.close(10);
    pool = null;
  }
}

module.exports = { initializeDatabase, getConnection, closeDatabase };
