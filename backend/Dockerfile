# Backend multi-stage Dockerfile
# Stage 1: build
FROM node:18 AS builder
WORKDIR /app

# Copy package files and install deps
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci --omit=dev

# Copy rest and install dev deps for build steps (prisma generate may need dev deps)
COPY . .
RUN npm install

# Generate prisma client and build
RUN npm run prisma:generate || true
RUN npm run build

# Stage 2: production image
FROM node:18-slim
WORKDIR /app

# Install only production deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy build artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

ENV PORT=4000
EXPOSE 4000

CMD ["node", "dist/index.js"]
