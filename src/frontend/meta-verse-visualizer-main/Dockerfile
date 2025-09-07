## Multi-stage build: build app with Node, serve with nginx
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
# Use npm ci when a lockfile exists (recommended in CI). Fall back to npm install
# for local development when package-lock.json may be missing.
RUN if [ -f package-lock.json ]; then \
			npm ci --legacy-peer-deps; \
		else \
			npm install --legacy-peer-deps; \
		fi

# Copy source and build
COPY . .
RUN npm run build

# Production image: nginx static server
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config (optional override)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
