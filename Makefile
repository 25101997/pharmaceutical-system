SHELL := /bin/bash
D := deploy/docker
DEV := docker compose --env-file $(D)/.env.dev -f $(D)/docker-compose.dev.yml
QA := docker compose --env-file $(D)/.env.qa -f $(D)/docker-compose.qa.yml
PROD := docker compose --env-file $(D)/.env.prod -f $(D)/docker-compose.prod.yml

.PHONY: help setup dev dev-build dev-down dev-logs dev-ps dev-reset qa qa-build qa-down qa-logs qa-ps qa-reset prod prod-build prod-down prod-logs prod-ps backup-prod backup-qa config-dev config-qa config-prod

help:
	@echo ""
	@echo "Farmacias System - DEV / QA / PROD"
	@echo "------------------------------------------------"
	@echo "make setup       Crea archivos .env faltantes"
	@echo "make dev         Levanta DEV"
	@echo "make dev-build   Reconstruye y levanta DEV"
	@echo "make dev-logs    Logs DEV"
	@echo "make dev-down    Detiene DEV"
	@echo "make dev-reset   Elimina DEV + volumen Oracle"
	@echo "make qa          Levanta QA"
	@echo "make qa-build    Reconstruye y levanta QA"
	@echo "make qa-logs     Logs QA"
	@echo "make qa-down     Detiene QA"
	@echo "make prod        Levanta PROD"
	@echo "make prod-build  Reconstruye y levanta PROD"
	@echo "make prod-logs   Logs PROD"
	@echo "make prod-down   Detiene PROD"
	@echo "make backup-prod Exporta esquema Oracle PROD"
	@echo ""

setup:
	@test -f $(D)/.env.dev || cp $(D)/.env.dev.example $(D)/.env.dev
	@test -f $(D)/.env.qa || cp $(D)/.env.qa.example $(D)/.env.qa
	@test -f $(D)/.env.prod || cp $(D)/.env.prod.example $(D)/.env.prod
	@echo "Archivos de ambiente listos en $(D)/.env.*"

dev: setup
	$(DEV) up -d

dev-build: setup
	$(DEV) up -d --build

dev-down:
	$(DEV) down

dev-logs:
	$(DEV) logs -f

dev-ps:
	$(DEV) ps

dev-reset:
	$(DEV) down -v --remove-orphans

qa: setup
	$(QA) up -d

qa-build: setup
	$(QA) up -d --build

qa-down:
	$(QA) down

qa-logs:
	$(QA) logs -f

qa-ps:
	$(QA) ps

qa-reset:
	$(QA) down -v --remove-orphans

prod: setup
	$(PROD) up -d

prod-build: setup
	$(PROD) up -d --build

prod-down:
	$(PROD) down

prod-logs:
	$(PROD) logs -f

prod-ps:
	$(PROD) ps

config-dev: setup
	$(DEV) config

config-qa: setup
	$(QA) config

config-prod: setup
	$(PROD) config

backup-prod:
	ENV_FILE=$(D)/.env.prod COMPOSE_FILE=$(D)/docker-compose.prod.yml ./scripts/backup-db.sh

backup-qa:
	ENV_FILE=$(D)/.env.qa COMPOSE_FILE=$(D)/docker-compose.qa.yml ./scripts/backup-db.sh
