const router = require('express').Router();
const { getConnection } = require('../config/database');

const cfg = {
  farmacias: { table:'FARMACIAS', fields:['CODIGO','NOMBRE','DIRECCION','DEPARTAMENTO','TELEFONO','ACTIVO'], order:'ID DESC' },
  medicamentos: { table:'MEDICAMENTOS', fields:['CODIGO','NOMBRE','PRESENTACION','LABORATORIO','PRECIO','REQUIERE_RECETA','ACTIVO'], order:'ID DESC' },
  activos: { table:'ACTIVOS', fields:['FARMACIA_ID','CODIGO','NOMBRE','CATEGORIA','VALOR','FECHA_ADQUISICION','ESTADO'], order:'ID DESC' },
  empleados: { table:'EMPLEADOS', fields:['FARMACIA_ID','CODIGO','NOMBRE','PUESTO','SALARIO_BASE','FECHA_INGRESO','ACTIVO'], order:'ID DESC' },
  clientes: { table:'CLIENTES', fields:['NIT','NOMBRE','TELEFONO','EMAIL','DIRECCION'], order:'ID DESC' }
};

function resource(req) { const c=cfg[req.params.resource]; if(!c){const e=new Error('Recurso no soportado');e.status=404;throw e;} return c; }
router.get('/:resource', async(req,res,next)=>{let c;try{const x=resource(req);c=await getConnection();const r=await c.execute(`SELECT * FROM ${x.table} ORDER BY ${x.order}`);res.json(r.rows)}catch(e){next(e)}finally{if(c)await c.close()}});
router.get('/:resource/:id', async(req,res,next)=>{let c;try{const x=resource(req);c=await getConnection();const r=await c.execute(`SELECT * FROM ${x.table} WHERE ID=:id`,{id:req.params.id});if(!r.rows.length)return res.status(404).json({error:'Registro no encontrado'});res.json(r.rows[0])}catch(e){next(e)}finally{if(c)await c.close()}});
router.post('/:resource', async(req,res,next)=>{let c;try{const x=resource(req);const fields=x.fields.filter(f=>Object.prototype.hasOwnProperty.call(req.body,f));if(!fields.length)return res.status(400).json({error:'No hay campos válidos'});const binds={};fields.forEach(f=>binds[f]=req.body[f]);c=await getConnection();const sql=`INSERT INTO ${x.table} (${fields.join(',')}) VALUES (${fields.map(f=>':'+f).join(',')}) RETURNING ID INTO :outId`;binds.outId={dir:require('oracledb').BIND_OUT,type:require('oracledb').NUMBER};const r=await c.execute(sql,binds,{autoCommit:true});res.status(201).json({id:r.outBinds.outId[0]})}catch(e){next(e)}finally{if(c)await c.close()}});
router.put('/:resource/:id', async(req,res,next)=>{let c;try{const x=resource(req);const fields=x.fields.filter(f=>Object.prototype.hasOwnProperty.call(req.body,f));if(!fields.length)return res.status(400).json({error:'No hay campos válidos'});const binds={id:req.params.id};fields.forEach(f=>binds[f]=req.body[f]);c=await getConnection();const r=await c.execute(`UPDATE ${x.table} SET ${fields.map(f=>`${f}=:${f}`).join(',')} WHERE ID=:id`,binds,{autoCommit:true});if(!r.rowsAffected)return res.status(404).json({error:'Registro no encontrado'});res.json({ok:true})}catch(e){next(e)}finally{if(c)await c.close()}});
router.delete('/:resource/:id', async(req,res,next)=>{let c;try{const x=resource(req);c=await getConnection();const active=x.fields.includes('ACTIVO');const r=await c.execute(active?`UPDATE ${x.table} SET ACTIVO=0 WHERE ID=:id`:`DELETE FROM ${x.table} WHERE ID=:id`,{id:req.params.id},{autoCommit:true});if(!r.rowsAffected)return res.status(404).json({error:'Registro no encontrado'});res.json({ok:true})}catch(e){next(e)}finally{if(c)await c.close()}});
module.exports=router;
