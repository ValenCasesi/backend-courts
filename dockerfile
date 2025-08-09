# Etapa 1: Build
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm install

COPY . .

# Generar cliente de Prisma (pero NO migraciones)
RUN npx prisma generate

RUN npm run build

# Etapa 2: Producción
FROM node:22-alpine
WORKDIR /app

COPY --from=build /app/package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/app.js"]
