.PHONY: dev build down logs seed

dev:
	@echo "Starting development environment..."
	@docker compose -f docker-compose.dev.yml build --no-cache
	@docker compose -f docker-compose.dev.yml up -d

	@echo "Using FRONTEND_PORT=$${FRONTEND_PORT:-5173}"
	@echo "Waiting for frontend (Vite) to be ready on port $${FRONTEND_PORT:-5173}..."
	@./scripts/wait-for-port.sh $${FRONTEND_PORT:-5173} 60 || echo "Timeout waiting for Vite"

	@echo "Tailing frontend logs (press Ctrl-C to exit)"
	@docker compose -f docker-compose.dev.yml logs -f frontend

seed-all: seed seed-more

seed-more:
	@./scripts/seed-more.sh

build:
	@docker compose build
	@docker compose -f docker-compose.dev.yml build

down:
	@docker compose down -v
	@docker compose -f docker-compose.dev.yml down -v

logs:
	@docker compose logs -f
	@docker compose -f docker-compose.dev.yml logs -f

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
