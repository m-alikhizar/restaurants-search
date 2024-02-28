FROM node:alpine

RUN apk add --no-cache redis

RUN mkdir -p /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package.json yarn.lock ./

RUN yarn install --pure-lockfile

RUN chown -R node:node /usr/src/node-app

USER node

COPY --chown=node:node . .

EXPOSE 3000