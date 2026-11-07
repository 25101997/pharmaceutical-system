import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

@Component({selector:'app-root',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./app.component.html'})
export class AppComponent implements OnInit {
  logged=false; login={usuario:'admin',password:'Admin123!'}; user:any=null; error=''; notice=''; loading=false;
  section='dashboard'; dashboard:any={}; rows:any[]=[]; pharmacies:any[]=[]; medicines:any[]=[]; employees:any[]=[]; clients:any[]=[]; orders:any[]=[];
  form:any={}; transferItems:any[]=[{medicamentoId:null,cantidad:1}]; orderItems:any[]=[{medicamentoId:null,cantidad:1}];
  menu=[['dashboard','Resumen'],['farmacias','Farmacias'],['medicamentos','Medicamentos'],['inventario','Inventario'],['traslados','Traslados'],['activos','Activos'],['caja','Caja'],['empleados','Empleados'],['planillas','Planillas'],['clientes','Clientes'],['pedidos','Pedidos'],['entregas','Entregas']];
  constructor(private api:ApiService){}
  ngOnInit(){const t=localStorage.getItem('token');this.logged=!!t;this.user=JSON.parse(localStorage.getItem('user')||'null');if(this.logged)this.select('dashboard');}
  doLogin(){this.error='';this.api.login(this.login).subscribe({next:r=>{localStorage.setItem('token',r.token);localStorage.setItem('user',JSON.stringify(r.user));this.user=r.user;this.logged=true;this.select('dashboard')},error:e=>this.error=e.error?.error||'No fue posible iniciar sesión'});}
  logout(){localStorage.clear();this.logged=false;this.user=null;this.rows=[];}
  select(s:string){this.section=s;this.error='';this.notice='';this.form={};this.loadLookups();this.refresh();}
  loadLookups(){this.api.get('/crud/farmacias').subscribe({next:r=>this.pharmacies=r});this.api.get('/crud/medicamentos').subscribe({next:r=>this.medicines=r});this.api.get('/crud/empleados').subscribe({next:r=>this.employees=r});this.api.get('/crud/clientes').subscribe({next:r=>this.clients=r});this.api.get('/pedidos').subscribe({next:r=>this.orders=r});}
  refresh(){this.loading=true;let path='';if(this.section==='dashboard')path='/dashboard';else if(['farmacias','medicamentos','activos','empleados','clientes'].includes(this.section))path='/crud/'+this.section;else path='/'+this.section;this.api.get(path).subscribe({next:r=>{if(this.section==='dashboard')this.dashboard=r;else this.rows=r;this.loading=false},error:e=>{this.error=e.error?.error||'Error al consultar';this.loading=false;if(e.status===401)this.logout();}})}
  saveCrud(resource:string){const payload={...this.form};['PRECIO','VALOR','SALARIO_BASE','ACTIVO','REQUIERE_RECETA','FARMACIA_ID'].forEach(k=>{if(payload[k]!==undefined&&payload[k]!=='')payload[k]=Number(payload[k])});this.api.post('/crud/'+resource,payload).subscribe({next:()=>this.done('Registro guardado'),error:e=>this.fail(e)});}
  adjustInventory(){const p={farmaciaId:Number(this.form.farmaciaId),medicamentoId:Number(this.form.medicamentoId),cantidad:Number(this.form.cantidad),stockMinimo:this.form.stockMinimo!==''?Number(this.form.stockMinimo):null,lote:this.form.lote||null,fechaVencimiento:this.form.fechaVencimiento||null};this.api.post('/inventario/ajuste',p).subscribe({next:()=>this.done('Inventario actualizado'),error:e=>this.fail(e)});}
  addTransferItem(){this.transferItems.push({medicamentoId:null,cantidad:1});}
  createTransfer(){const p={origenId:Number(this.form.origenId),destinoId:Number(this.form.destinoId),observaciones:this.form.observaciones||'',items:this.transferItems.map(x=>({medicamentoId:Number(x.medicamentoId),cantidad:Number(x.cantidad)}))};this.api.post('/traslados',p).subscribe({next:()=>{this.transferItems=[{medicamentoId:null,cantidad:1}];this.done('Traslado creado')},error:e=>this.fail(e)});}
  receiveTransfer(id:number){if(confirm('¿Confirmar recepción? Esto moverá existencias.'))this.api.put(`/traslados/${id}/recibir`,{}).subscribe({next:()=>this.done('Traslado recibido'),error:e=>this.fail(e)});}
  createCash(){this.api.post('/caja',{farmaciaId:Number(this.form.farmaciaId),tipo:this.form.tipo,concepto:this.form.concepto,monto:Number(this.form.monto),referencia:this.form.referencia||''}).subscribe({next:()=>this.done('Movimiento registrado'),error:e=>this.fail(e)});}
  createPayroll(){this.api.post('/planillas',{empleadoId:Number(this.form.empleadoId),periodo:this.form.periodo,salarioBase:Number(this.form.salarioBase),bonificacion:Number(this.form.bonificacion||0),descuentos:Number(this.form.descuentos||0),estado:'PENDIENTE',fechaPago:null}).subscribe({next:()=>this.done('Planilla registrada'),error:e=>this.fail(e)});}
  addOrderItem(){this.orderItems.push({medicamentoId:null,cantidad:1});}
  createOrder(){this.api.post('/pedidos',{clienteId:Number(this.form.clienteId),farmaciaId:Number(this.form.farmaciaId),direccionEntrega:this.form.direccionEntrega||'',items:this.orderItems.map(x=>({medicamentoId:Number(x.medicamentoId),cantidad:Number(x.cantidad)}))}).subscribe({next:r=>{this.orderItems=[{medicamentoId:null,cantidad:1}];this.done(`Pedido #${r.id} creado - Total Q${Number(r.total).toFixed(2)}`)},error:e=>this.fail(e)});}
  orderStatus(id:number,estado:string){this.api.put(`/pedidos/${id}/estado`,{estado}).subscribe({next:()=>this.done('Estado actualizado'),error:e=>this.fail(e)});}
  createDelivery(){this.api.post('/entregas',{pedidoId:Number(this.form.pedidoId),repartidor:this.form.repartidor,telefonoRepartidor:this.form.telefonoRepartidor}).subscribe({next:()=>this.done('Entrega asignada'),error:e=>this.fail(e)});}
  deliveryStatus(id:number,estado:string){this.api.put(`/entregas/${id}/estado`,{estado}).subscribe({next:()=>this.done('Entrega actualizada'),error:e=>this.fail(e)});}
  remove(resource:string,id:number){if(confirm('¿Desactivar/eliminar este registro?'))this.api.delete(`/crud/${resource}/${id}`).subscribe({next:()=>this.done('Registro actualizado'),error:e=>this.fail(e)});}
  done(msg:string){this.notice=msg;this.error='';this.form={};this.refresh();this.loadLookups();}
  fail(e:any){this.error=e.error?.error||'No fue posible completar la operación';}
  money(v:any){return Number(v||0).toLocaleString('es-GT',{style:'currency',currency:'GTQ'});}
}
