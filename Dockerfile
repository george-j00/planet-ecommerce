# syntax=docker/dockerfile:1

FROM node:21-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
# Command to start your Node.js application in production
CMD ["node", "app.js"]

