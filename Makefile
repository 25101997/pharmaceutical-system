ENV_LOCAL=deploy/docker/.env
ENV_PROD=deploy/docker/.env.prod
COMPOSE_LOCAL=docker compose -f deploy/docker/docker-compose.yml --env-file $(ENV_LOCAL)
COMPOSE_PROD=docker compose -f deploy/docker/docker-compose.prod.yml --env-file $(ENV_PROD)

.PHONY: help setup up build logs down ps restart api-shell web-shell db-shell \
        prod-setup prod-build prod-up prod-start prod-logs prod-down prod-ps prod-restart \
        backup-prod clean

help:
	@echo ""
	@echo "Farmacias System"
	@echo ""
	@echo "Desarrollo:"
	@echo "  make setup        Crear deploy/docker/.env desde el ejemplo"
	@echo "  make up           Levantar desarrollo (build incluido)"
	@echo "  make build        Reconstruir imagenes de desarrollo"
	@echo "  make logs         Ver logs de desarrollo"
	@echo "  make ps           Ver servicios de desarrollo"
	@echo "  make restart      Reiniciar servicios de desarrollo"
	@echo "  make down         Detener desarrollo"
	@echo "  make api-shell    Abrir shell en API"
	@echo "  make web-shell    Abrir shell en Angular"
	@echo "  make db-shell     Abrir shell en Oracle"
	@echo ""
	@echo "Produccion:"
	@echo "  make prod-setup   Crear deploy/docker/.env.prod desde el ejemplo"
	@echo "  make prod-build   Construir imagenes de produccion"
	@echo "  make prod-up      Construir y levantar produccion"
	@echo "  make prod-start   Levantar sin reconstruir"
	@echo "  make prod-logs    Ver logs de produccion"
	@echo "  make prod-ps      Ver servicios de produccion"
	@echo "  make prod-restart Reiniciar produccion"
	@echo "  make prod-down    Detener produccion"
	@echo "  make backup-prod  Exportar esquema Oracle con Data Pump"
	@echo ""

setup:
	@test -f $(ENV_LOCAL) || cp deploy/docker/.env.example $(ENV_LOCAL)
	@echo "Entorno local preparado: $(ENV_LOCAL)"

up: setup
	$(COMPOSE_LOCAL) up -d --build

build: setup
	$(COMPOSE_LOCAL) build

logs:
	$(COMPOSE_LOCAL) logs -f

ps:
	$(COMPOSE_LOCAL) ps

restart:
	$(COMPOSE_LOCAL) restart

down:
	$(COMPOSE_LOCAL) down

api-shell:
	$(COMPOSE_LOCAL) exec api sh

web-shell:
	$(COMPOSE_LOCAL) exec web sh

db-shell:
	$(COMPOSE_LOCAL) exec database bash

prod-setup:
	@test -f $(ENV_PROD) || cp deploy/docker/.env.prod.example $(ENV_PROD)
	@echo "Edita $(ENV_PROD) antes de desplegar."

prod-build:
	$(COMPOSE_PROD) build api web

prod-up:
	$(COMPOSE_PROD) up -d --build

prod-start:
	$(COMPOSE_PROD) up -d --no-build

prod-logs:
	$(COMPOSE_PROD) logs -f

prod-ps:
	$(COMPOSE_PROD) ps

prod-restart:
	$(COMPOSE_PROD) restart

prod-down:
	$(COMPOSE_PROD) down

backup-prod:
	bash scripts/backup-db.sh

clean:
	docker image prune -f
