.PHONY: dev build down logs seed

dev:
	@echo "Starting development environment..."
	@docker compose build --no-cache
	@docker compose up -d
	@./scripts/smoke-test.sh

seed-all: seed seed-more

seed-more:
	@./scripts/seed-more.sh

build:
	@docker compose build

down:
	@docker compose down -v

logs:
	@docker compose logs -f

seed:
	@./scripts/seed-db.sh

seed-reset:
	@echo "Resetting DB volume and seeding"
	@docker compose down -v
	@docker compose up -d postgres redis
	@./scripts/wait-for-postgres.sh
	@docker compose up -d api-server
	@sleep 2
	@docker compose exec api-server sh -c "npx prisma db push"
	@./scripts/seed-db.sh
	@docker compose up -d
