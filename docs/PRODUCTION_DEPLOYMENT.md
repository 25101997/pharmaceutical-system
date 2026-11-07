# Despliegue de producción

## 1. Requisitos
Ubuntu/Debian o cualquier Linux con Docker Engine, Docker Compose v2, Git y Make. Oracle XE requiere memoria suficiente; se recomienda al menos 4 GB de RAM para el servidor de demostración.

## 2. Preparar variables
```bash
make setup
nano deploy/docker/.env.prod
```
Cambie obligatoriamente `ORACLE_PASSWORD`, `DB_PASSWORD`, `JWT_SECRET` y `ADMIN_PASSWORD`. Ajuste `CORS_ALLOWED` y `PROD_WEB_PORT`.

## 3. Validar y desplegar
```bash
make config-prod
make prod-build
make prod-ps
make prod-logs
```
La aplicación queda en `http://IP_SERVIDOR:PROD_WEB_PORT`. Solo el contenedor web publica un puerto; API y Oracle permanecen en la red privada de Compose.

## 4. HTTPS recomendado
Si dispone de dominio, puede poner Nginx + Certbot en el host y usar `deploy/nginx/farmacias.conf.example`. En ese caso cambie `PROD_WEB_PORT=8088`, limite el puerto con firewall y haga que Nginx termine TLS.

## 5. Backup
```bash
make backup-prod
```
Los dumps quedan en `backups/` y no se versionan en Git.

## 6. Actualización
```bash
git pull
make prod-build
```
No use `docker compose down -v` en producción: `-v` elimina el volumen persistente de Oracle.
