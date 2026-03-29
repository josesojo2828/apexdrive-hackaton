# --- Base Stage ---
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN chown -R node:node /app

# --- Development Stage ---
FROM base AS development
USER node
WORKDIR /app
COPY --chown=node:node package.json package-lock.json* ./
RUN npm install
COPY --chown=node:node . .
RUN mkdir -p .next && chown -R node:node .next
CMD ["npm", "run", "dev"]

# --- Install dependencies stage ---
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install

# --- Builder Stage ---
FROM base AS builder
# Necesitamos estas variables en tiempo de BUILD (Next.js las hornea en el JS)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generamos el build standalone
RUN npm run build

# --- Production Stage (Imagen Final) ---
FROM base AS production
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Seguridad: No corremos como root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Solo copiamos lo mínimo indispensable del standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# El server.js lo genera Next automáticamente en modo standalone
CMD ["node", "server.js"]
