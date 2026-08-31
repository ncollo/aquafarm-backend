# ==========================================
# Aquafarm Backend - Multi-Stage Dockerfile
# ==========================================

# ─── Stage 1: Build & Compile ───
FROM node:22-alpine AS builder
WORKDIR /app

# Install build dependencies & OpenSSL for Prisma
RUN apk add --no-cache openssl

# Install dependencies (utilize layer caching)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Copy source code and build TypeScript
COPY tsconfig.json ./
COPY src ./src
RUN npx prisma generate
RUN npm run build

# Prune devDependencies for a lean production footprint
RUN npm prune --production

# ─── Stage 2: Lean Production Runtime ───
FROM node:22-alpine AS runner
WORKDIR /app

# Install runtime dependencies for Prisma engine
RUN apk add --no-cache openssl dumb-init curl

ENV NODE_ENV=production
ENV PORT=5000

# Create a non-root system user for container security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

# Copy pruned production node_modules and compiled output
COPY --from=builder --chown=expressjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=expressjs:nodejs /app/dist ./dist
COPY --from=builder --chown=expressjs:nodejs /app/package*.json ./
COPY --from=builder --chown=expressjs:nodejs /app/prisma ./prisma

# Switch to secure unprivileged user
USER expressjs

# Expose backend port
EXPOSE 5000

# Built-in Container Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Launch using dumb-init to properly handle PID 1 signals
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
