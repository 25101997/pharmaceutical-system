require('dotenv').config();

const app = require('./app');
const { initializeDatabase, closeDatabase } = require('./config/database');

const port = Number(process.env.PORT || 3000);
let server;

async function start() {
  try {
    await initializeDatabase();
    server = app.listen(port, '0.0.0.0', () => {
      console.log(`Farmacias API listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start API:', error);
    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);
  if (server) {
    server.close(async () => {
      await closeDatabase();
      process.exit(0);
    });
  } else {
    await closeDatabase();
    process.exit(0);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start();
