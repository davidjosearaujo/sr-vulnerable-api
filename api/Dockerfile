FROM node:latest

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install
RUN apt-get update && apt-get install -y sqlite3

COPY . .

CMD ["npm", "run" , "start"]
