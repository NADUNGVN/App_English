FROM node:20-alpine

WORKDIR /app/frontend/web_app

COPY frontend/web_app/package*.json ./
RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]
