# Stage 1: Build the React application
FROM node:20-alpine as builder

WORKDIR /app

# Copy root dependency-defining files
COPY package.json package-lock.json* ./

# Install all monorepo dependencies using ci for consistency
RUN npm ci

# Copy the entire monorepo source code
COPY . .

# Build the specific workspace application
RUN npm run build --workspace=packages/meta-verse-visualizer-main

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the custom Nginx configuration from the workspace directory
COPY packages/meta-verse-visualizer-main/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app from the builder stage
COPY --from=builder /app/packages/meta-verse-visualizer-main/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
