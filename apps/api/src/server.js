require('dotenv').config();
const app=require('./app');const {initializeDatabase,closeDatabase}=require('./config/database');const {ensureSchema}=require('./services/schema.service');
const port=Number(process.env.PORT||3000);
async function start(){let attempts=0;while(true){try{await initializeDatabase();await ensureSchema();break}catch(e){attempts++;console.error(`Esperando Oracle (${attempts}/30):`,e.message);if(attempts>=30)throw e;await new Promise(r=>setTimeout(r,5000));}}app.listen(port,'0.0.0.0',()=>console.log(`Farmacias API escuchando en ${port}`));}
async function shutdown(){try{await closeDatabase()}finally{process.exit(0)}}process.on('SIGTERM',shutdown);process.on('SIGINT',shutdown);start().catch(e=>{console.error(e);process.exit(1)});
