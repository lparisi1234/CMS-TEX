# Use Node.js 18 Debian (glibc), no Alpine
FROM node:18-bullseye-slim AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
# Dependencias del sistema necesarias
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copiamos manifest y lockfile si existe
COPY package.json package-lock.json* ./
# Instala dependencias sin ejecutar scripts (evita "nuxt prepare" en postinstall)
RUN npm ci --ignore-scripts

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN if [ -f prisma/schema.prisma ] || [ -f schema.prisma ]; then npx prisma generate; else echo 'Skipping prisma generate: schema.prisma not found'; fi

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Crear usuario no-root
RUN groupadd -g 1001 nodejs && useradd -u 1001 -g 1001 -s /usr/sbin/nologin nodejs

# Copy only the files that exist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/index.js ./
COPY --from=builder /app/package.json ./

# Remover dependencias de desarrollo en la imagen final
RUN npm prune --omit=dev

USER nodejs

EXPOSE 8080

ENV PORT=8080
ENV HOSTNAME=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Start the application
CMD ["node", "index.js"] 