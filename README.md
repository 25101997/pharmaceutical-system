# Farmacias System

MVP funcional para administración de una cadena de farmacias. Está pensado para el proyecto académico solicitado y para poder ejecutarse sin Kubernetes usando Docker Compose en tres ambientes independientes: **DEV, QA y PROD**.

## Stack
- Angular + TypeScript
- Node.js + Express
- Oracle XE
- JWT
- Docker / Docker Compose
- Nginx (sirve Angular y actúa como reverse proxy en QA/PROD)

## Módulos incluidos
Dashboard; farmacias; medicamentos; inventario con stock mínimo, lote y vencimiento; traslados entre sucursales con movimiento real de existencias al recibir; activos; ingresos/egresos de caja; empleados; planillas; clientes; pedidos; asignación y seguimiento de entregas.

## Estructura
```text
apps/api        API Express y bootstrap del esquema Oracle
apps/web        SPA Angular
database/init   documentación SQL
deploy/docker   Compose y variables DEV/QA/PROD
deploy/nginx    ejemplo de proxy HTTPS externo
scripts         despliegue y backup
docs            guía de producción
```

## Inicio rápido DEV
```bash
make setup
make dev-build
make dev-ps
```
Abra **http://localhost:4200**.

Credenciales iniciales DEV:
- usuario: `admin`
- contraseña: `Admin123!`

API health: `http://localhost:3000/api/health`
Oracle DEV: `localhost:1521`, servicio `XEPDB1`.

> En el primer arranque Oracle puede tardar algunos minutos. La API espera la base de datos y crea automáticamente el esquema y datos mínimos.

## QA
Edite `deploy/docker/.env.qa` después de `make setup` y cambie todos los valores `CHANGE_ME_*`.
```bash
make qa-build
make qa-ps
```
Por defecto: **http://localhost:8080**. Oracle QA solo se publica en `127.0.0.1:1522` para administración local.

## Producción
Edite `deploy/docker/.env.prod` y cambie todos los secretos.
```bash
make config-prod
make prod-build
make prod-ps
```
Por defecto publica el sitio en puerto **80**. API y Oracle no publican puertos al host.

## Comandos útiles
```bash
make help
make dev-logs
make qa-logs
make prod-logs
make backup-prod
```

## Datos persistentes
Cada ambiente usa un proyecto y volumen de Oracle distinto. `make dev-reset`/`make qa-reset` borran sus datos y deben usarse solo para reiniciar ambientes no productivos. No hay objetivo `prod-reset` deliberadamente.

## Seguridad antes de exponer PROD
Cambie todas las claves, use HTTPS, restrinja firewall a 80/443 (o al puerto del proxy), mantenga Docker/OS actualizados y programe backups. Este repositorio es un MVP académico/operativo, no sustituye revisión de seguridad, cumplimiento farmacéutico, auditoría financiera o alta disponibilidad.
