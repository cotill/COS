# syntax=docker/dockerfile:1

FROM node:18-alpine AS base

# Stage 1 - Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package management files
COPY frontend/package.json .
COPY frontend/package-lock.json .

# Install exact versions (production only)
RUN npm ci --omit=dev

# Stage 2 - Build application
FROM base AS builder
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY frontend .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build application (ensure output: 'standalone' in next.config.js)
RUN npm run build

# Stage 3 - Production runtime
FROM base AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S -u 1001 -G nodejs nextjs

# Copy static assets
COPY --from=builder /app/public ./public

# Copy built application (with proper permissions)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Use non-privileged user
USER nextjs

# Network settings
EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

# Start the application
CMD ["node", "server.js"]