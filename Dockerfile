# Frontend multi-stage Dockerfile (Vite + React)
FROM node:18 AS builder
WORKDIR /app

# Install deps
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci

# Copy and build
COPY . .
# Remove storybook stories to avoid build-time type errors when Storybook deps are not present
RUN find . -type f -iname "*.stories.*" -delete || true
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
