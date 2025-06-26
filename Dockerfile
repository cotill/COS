# syntax=docker/dockerfile:1

FROM node:18-alpine AS base

# Stage 1 - Install dependencies (include devDependencies)
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY frontend/package.json .
COPY frontend/package-lock.json .

# Include devDependencies for build stage
RUN npm i

# Stage 2 - Build application
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY frontend .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Stage 3 - Production runtime (omit dev deps here)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs
RUN adduser -S -u 1001 -G nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["node", "server.js"]
