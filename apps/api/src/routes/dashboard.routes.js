const router = require('express').Router();
const { getConnection } = require('../config/database');
router.get('/', async (req,res,next)=>{ let c; try { c=await getConnection(); const r=await c.execute(`SELECT
 (SELECT COUNT(*) FROM FARMACIAS WHERE ACTIVO=1) FARMACIAS,
 (SELECT COUNT(*) FROM MEDICAMENTOS WHERE ACTIVO=1) MEDICAMENTOS,
 (SELECT NVL(SUM(EXISTENCIA),0) FROM INVENTARIO) UNIDADES,
 (SELECT COUNT(*) FROM INVENTARIO WHERE EXISTENCIA<=STOCK_MINIMO) STOCK_BAJO,
 (SELECT NVL(SUM(CASE WHEN TIPO='INGRESO' THEN MONTO ELSE -MONTO END),0) FROM MOVIMIENTOS_CAJA WHERE TRUNC(FECHA)=TRUNC(SYSDATE)) CAJA_HOY,
 (SELECT COUNT(*) FROM PEDIDOS WHERE ESTADO NOT IN ('ENTREGADO','CANCELADO')) PEDIDOS_ABIERTOS
 FROM DUAL`); res.json({...r.rows[0], ENVIRONMENT: process.env.NODE_ENV || 'development'}); } catch(e){next(e)} finally{if(c)await c.close()} });
module.exports=router;
