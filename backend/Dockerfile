FROM node:20-alpine AS base

# Install netcat for database wait logic
RUN apk add --no-cache netcat-openbsd

WORKDIR /app
RUN chown -R node:node /app

# --- Development Stage ---
FROM base AS development
USER node
COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/
RUN npm install
RUN npx prisma generate --schema=prisma/schema.prisma
COPY --chown=node:node . .

# Migrations and start with watch mode
CMD sh -c "npx prisma migrate deploy --schema=prisma/schema.prisma && npm run dev"

# --- Build Stage ---
FROM base AS builder
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build

# --- Production Stage ---
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
# Install only production dependencies
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Default port
ENV PORT=9999
EXPOSE ${PORT}

# Wait for db, run migrations, and start
CMD sh -c "until nc -z postgres 5432; do echo 'Waiting for postgres...'; sleep 2; done && npx prisma migrate deploy --schema=prisma/schema.prisma && node dist/src/main"
