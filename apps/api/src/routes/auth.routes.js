const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../config/database');

router.post('/login', async (req, res, next) => {
  const { usuario, password } = req.body || {};
  if (!usuario || !password) return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  let conn;
  try {
    conn = await getConnection();
    const r = await conn.execute(`SELECT u.ID,u.USUARIO,u.NOMBRE,u.EMAIL,u.PASSWORD_HASH,u.FARMACIA_ID,r.NOMBRE ROL
      FROM USUARIOS u JOIN ROLES r ON r.ID=u.ROL_ID WHERE LOWER(u.USUARIO)=LOWER(:usuario) AND u.ACTIVO=1`, { usuario });
    if (!r.rows.length || !(await bcrypt.compare(password, r.rows[0].PASSWORD_HASH))) return res.status(401).json({ error: 'Credenciales inválidas' });
    const u = r.rows[0];
    const token = jwt.sign({ id:u.ID, usuario:u.USUARIO, nombre:u.NOMBRE, rol:u.ROL, farmaciaId:u.FARMACIA_ID }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
    res.json({ token, user: { id:u.ID, usuario:u.USUARIO, nombre:u.NOMBRE, rol:u.ROL, farmaciaId:u.FARMACIA_ID } });
  } catch (e) { next(e); } finally { if (conn) await conn.close(); }
});
module.exports = router;
