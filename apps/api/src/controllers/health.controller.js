const { getConnection } = require('../config/database');

async function health(req, res) {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute('SELECT 1 FROM DUAL');

    res.status(200).json({
      status: 'healthy',
      service: 'farmacias-api',
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'farmacias-api',
      database: 'disconnected'
    });
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = { health };
