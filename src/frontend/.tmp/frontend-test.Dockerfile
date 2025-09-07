FROM node:20-bullseye-slim
WORKDIR /workspace
# copiar package.json raíz para instalar devDeps (vitest) y luego instalar
# copiar solo package files del frontend e instalar dependencias del frontend
COPY frontend/package.json frontend/package-lock.json ./src/frontend/
WORKDIR /workspac./src/frontend
RUN npm ci --no-audit --no-fund || true
# instalar vitest y testing libs localmente (frontend) para que `npm test` funcione
RUN npm install --no-audit --no-fund -D vitest@3.2.4 @testing-library/react @testing-library/user-event jsdom

# copiar el código del frontend
WORKDIR /workspace
COPY frontend ./src/frontend
WORKDIR /workspac./src/frontend
CMD ["/bin/sh", "-c", "npx vitest --run"]
