FROM node:14

WORKDIR /app
COPY src/ /app/src/
COPY package.json /app/
COPY yarn.lock /app/
COPY babel.config.js /app/
COPY tsconfig.json /app/
COPY nodemon.json /app/
COPY .env /app/
COPY app.config.json /app/

RUN yarn install
EXPOSE 3000

