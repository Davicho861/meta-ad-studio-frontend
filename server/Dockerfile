# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
# Copy prisma schema to generate client
COPY prisma ./prisma
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Prisma needs OpenSSL
RUN apk add --no-cache openssl

# Copy production dependencies configuration
COPY package.json package-lock.json* ./

# Copy prisma schema
COPY --from=builder /app/prisma ./prisma

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 3001

# Start the server
CMD ["node", "dist/index.js"]
