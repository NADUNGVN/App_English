FROM node:20-alpine

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY database /app/database
RUN npx prisma generate --schema /app/database/prisma/schema.prisma

EXPOSE 3001

CMD ["npm", "run", "dev"]
