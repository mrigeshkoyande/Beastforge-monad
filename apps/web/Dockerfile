# ──────────────────────────────────────────────────────────────────────────────
# MONAD HUNT: CITY LEAGUE — Production Docker Build
# Multi-stage build for minimal image size with standalone Next.js output
# ──────────────────────────────────────────────────────────────────────────────

# Stage 1: Base
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Stage 2: Dependencies (cached layer — only rebuilds when package files change)
FROM base AS deps
COPY package.json package-lock.json* .npmrc* ./
# Install with error-only logging to suppress deprecation noise
RUN npm ci --loglevel=error --no-fund --no-audit

# Stage 3: Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Enable standalone output for Docker (creates self-contained server.js)
ENV NEXT_STANDALONE=true

ARG NEXT_PUBLIC_MONAD_CHAIN_ID=10143
ARG NEXT_PUBLIC_MONAD_RPC_URL=https://testnet-rpc.monad.xyz/
ARG NEXT_PUBLIC_MONAD_EXPLORER_URL=https://testnet.monadexplorer.com
ARG NEXT_PUBLIC_HUNT_CORE_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
ARG NEXT_PUBLIC_BEAST_NFT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
ARG NEXT_PUBLIC_RESOLVER_ADDRESS=0xa0Ee7A142d267C1f36714E4a8F75612F20a79720

ENV NEXT_PUBLIC_MONAD_CHAIN_ID=$NEXT_PUBLIC_MONAD_CHAIN_ID
ENV NEXT_PUBLIC_MONAD_RPC_URL=$NEXT_PUBLIC_MONAD_RPC_URL
ENV NEXT_PUBLIC_MONAD_EXPLORER_URL=$NEXT_PUBLIC_MONAD_EXPLORER_URL
ENV NEXT_PUBLIC_HUNT_CORE_ADDRESS=$NEXT_PUBLIC_HUNT_CORE_ADDRESS
ENV NEXT_PUBLIC_BEAST_NFT_ADDRESS=$NEXT_PUBLIC_BEAST_NFT_ADDRESS
ENV NEXT_PUBLIC_RESOLVER_ADDRESS=$NEXT_PUBLIC_RESOLVER_ADDRESS
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Stage 4: Production Runner (minimal, no dev deps)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
