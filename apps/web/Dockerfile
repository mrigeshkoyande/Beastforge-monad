# Multi-stage production build for Monad Hunt: City League
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Stage 1: Dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

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

# Stage 3: Production Runner
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

CMD ["node", "server.js"]
