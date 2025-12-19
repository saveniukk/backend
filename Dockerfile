FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

FROM base AS test
WORKDIR /usr/src/app
COPY . .
RUN npm run test

FROM base AS builder
WORKDIR /usr/src/app
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /usr/src/app

# Install postgresql-client for pg_isready
RUN apk add --no-cache postgresql-client

COPY package*.json ./
RUN npm ci --omit=dev && npm install dotenv prisma

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /usr/src/app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /usr/src/app/prisma ./prisma
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 10000
ENTRYPOINT ["./docker-entrypoint.sh"]