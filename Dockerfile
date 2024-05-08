FROM node:16 AS builder

WORKDIR /app

COPY . .

RUN npm ci --ignore-scripts

RUN npm run build

FROM node:16-slim

WORKDIR /app

COPY package*.json .

COPY .env .

RUN npm ci --ignore-scripts

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "npm", "run", "start" ]