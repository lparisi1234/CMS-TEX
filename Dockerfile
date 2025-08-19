# Nuxt 4 production build & run using Debian Bookworm (latest stable)
FROM node:20-bookworm-slim AS base

# ---------- Dependencies layer ----------
FROM base AS deps
WORKDIR /app
# Instalar todas las dependencias necesarias para bindings nativos
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    curl \
    pkg-config \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
# Instalar dependencias y forzar rebuild de bindings nativos
RUN npm ci --ignore-scripts
RUN npm rebuild

# ---------- Build layer ----------
FROM deps AS builder
WORKDIR /app
COPY . .
# Preparar y compilar Nuxt (esto genera .output)
RUN npx nuxt prepare && npm run build

# ---------- Runtime layer ----------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
# Usuario no-root
RUN groupadd -g 1001 nodejs && useradd -u 1001 -g 1001 -s /usr/sbin/nologin nodejs

# Copiamos solo el artefacto compilado
COPY --from=builder /app/.output ./.output

USER nodejs
EXPOSE 8080
ENV NITRO_PORT=8080
ENV NITRO_HOST=0.0.0.0

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Ejecuta el servidor Nitro generado por Nuxt
CMD ["node", ".output/server/index.mjs"] 