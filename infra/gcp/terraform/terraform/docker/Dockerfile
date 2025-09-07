# Fase 1: Construcción de la aplicación
FROM node:20-alpine AS builder

# Instalar pnpm
RUN npm install -g pnpm

# Establecer el directorio de trabajo para el servidor
WORKDIR /usr/src/app/server

# Copiar los archivos de manifiesto del servidor y el lockfile
COPY server/package.json server/pnpm-lock.yaml* ./

# Instalar dependencias del servidor
RUN pnpm install

# Copiar el resto del código del servidor
COPY server/ ./

# Generar el cliente de Prisma
RUN pnpm prisma generate

# Compilar el servidor
RUN pnpm tsc

# Establecer el directorio de trabajo para el cliente
WORKDIR /usr/src/app

# Copiar los archivos de manifiesto del cliente y el lockfile
COPY package.json pnpm-lock.yaml* ./

# Instalar dependencias del cliente
RUN pnpm install

# Copiar el resto del código del cliente
COPY . .

# Construir la aplicación cliente
RUN pnpm build

# Fase 2: Creación de la imagen final
FROM node:20-alpine

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /usr/src/app

# Copiar dependencias de producción del servidor desde la fase de construcción
COPY --from=builder /usr/src/app/server/node_modules ./server/node_modules
COPY --from=builder /usr/src/app/server/package.json ./server/

# Copiar el cliente de Prisma generado
COPY --from=builder /usr/src/app/server/node_modules/.prisma ./server/node_modules/.prisma
COPY --from=builder /usr/src/app/server/prisma ./server/prisma

# Copiar el código compilado del servidor
COPY --from=builder /usr/src/app/server/dist ./server/dist
COPY --from=builder /usr/src/app/server/package.json ./server/package.json

# Copiar la aplicación cliente construida
COPY --from=builder /usr/src/app/dist ./dist

# Exponer el puerto
ARG PORT=8080
ENV PORT=${PORT}
EXPOSE ${PORT}

# Comando para iniciar la aplicación
CMD ["sh", "-c", "node server/dist/index.js"]
