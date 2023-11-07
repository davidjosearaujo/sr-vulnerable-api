FROM node:latest


WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install && \
    npm install express-jwt

COPY . .

CMD ["npm", "run" , "start:dev"]
