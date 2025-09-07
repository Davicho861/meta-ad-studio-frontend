# Multi-stage Dockerfile optimized for production
# Builder: install deps and build the TypeScript app
FROM node:20-slim AS builder
WORKDIR /app

# Install system deps needed for some native modules and prisma
RUN apt-get update \
	&& apt-get install -y --no-install-recommends build-essential python3 openssl ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

# Copy package manifests and install all dependencies (including dev for build)
COPY package*.json ./
COPY prisma ./prisma/
# Use npm ci when a lockfile exists (CI). Fall back to npm install for local dev.
RUN if [ -f package-lock.json ]; then \
			npm ci; \
		else \
			npm install --legacy-peer-deps; \
		fi

# Copy source and build
COPY . .
RUN npm run build

# Remove dev deps to keep node_modules small
RUN npm prune --production || true

# Runtime image: smaller surface area
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Ensure OpenSSL is available at runtime for Prisma
RUN apt-get update \
	&& apt-get install -y --no-install-recommends openssl ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

# Copy built artifacts and production node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

# Default start command uses dotenv to load environment when present
CMD ["node", "-r", "dotenv/config", "dist/index.js"]
