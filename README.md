# Farmacias System

Plantilla base para el proyecto de farmacias, adaptada del patrón usado en `swt3ch-solutions`.

## Stack

- Frontend: Angular + TypeScript
- Backend: Node.js + Express
- Base de datos: Oracle XE
- Contenedores: Docker + Docker Compose
- Producción: Nginx del host como reverse proxy + HTTPS

## Estructura

```text
farmacias-system/
├── apps/
│   ├── api/                 # Express
│   └── web/                 # Angular
├── database/init/           # SQL inicial de Oracle
├── deploy/
│   ├── docker/              # Compose dev/prod + variables
│   └── nginx/               # Reverse proxy del servidor
├── scripts/                 # deploy / backup
├── docs/
├── backups/
├── Makefile
└── README.md
```

## Desarrollo

```bash
make setup
nano deploy/docker/.env
make up
make ps
```

Servicios:

- Angular: http://localhost:4200
- API: http://localhost:3000/api
- Health: http://localhost:3000/api/health
- Oracle: localhost:1521 (solo desarrollo)

La aplicación Angular usa `/api` y el proxy de Angular redirige internamente a `http://api:3000`.

### Comandos frecuentes

```bash
make logs
make api-shell
make web-shell
make db-shell
make restart
make down
```

## Producción

```bash
make prod-setup
nano deploy/docker/.env.prod
make prod-up
make prod-ps
```

En producción:

- Angular container: `127.0.0.1:3110`
- API container: `127.0.0.1:8180`
- Oracle: solo red privada Docker
- Nginx del host: publica 80/443

Consulta `docs/PRODUCTION_DEPLOYMENT.md` para el procedimiento completo.

## Importante sobre Oracle init

Los scripts de `database/init/` se ejecutan cuando se crea por primera vez el volumen de Oracle. Si el volumen ya existe, no se vuelven a aplicar automáticamente.

Para reiniciar completamente el ambiente de desarrollo y recrear la base desde cero:

```bash
docker compose -f deploy/docker/docker-compose.yml --env-file deploy/docker/.env down -v
make up
```

Esto elimina los datos locales del volumen, por lo que debe usarse solo cuando quieras recrear la base de desarrollo.
