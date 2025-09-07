# Backend multi-stage Dockerfile
# Stage 1: build
FROM node:18 AS builder
WORKDIR /app

# Copy package files and install deps (package-lock.json may be absent in dev tree)
COPY package.json tsconfig.json ./
# If package-lock.json exists, use npm ci for reproducible install, otherwise fall back to npm install
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev --legacy-peer-deps; fi

# Copy rest and install dev deps for build steps (prisma generate may need dev deps)
COPY . .
# Install production deps only to avoid problematic dev dependency resolution in the container,
# then install only the dev tools required for the TypeScript build (avoid @types/bcrypt).
RUN npm install --omit=dev --legacy-peer-deps
RUN npm install --save-dev typescript @types/express @types/jsonwebtoken --legacy-peer-deps

# Generate prisma client and build
RUN npm run prisma:generate || true
RUN npm run build

# Stage 2: production image
FROM node:18-slim
WORKDIR /app

# Ensure system OpenSSL is available for Prisma native engines
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

# Install only production deps
COPY package.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev --legacy-peer-deps; fi

# Copy build artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

ENV PORT=4000
EXPOSE 4000

CMD ["node", "dist/index.js"]
