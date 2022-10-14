FROM node:18-alpine

WORKDIR /var/www/bull-ui

COPY package.json ./
COPY yarn.lock ./


COPY . .

RUN yarn --pure-lockfile

CMD [ "node", "src/index.js" ]


