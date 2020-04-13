FROM node:lts-alpine

ENV UID=1000
ENV GID=1000

WORKDIR /app/

COPY . /app/

RUN rm -rf node_modules > /dev/null 2>&1

RUN npm i --production

CMD ["node", "index.js"]

