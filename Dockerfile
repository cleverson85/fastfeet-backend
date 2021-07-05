FROM node:12-alpine as node

WORKDIR /app
COPY ["package.json", "yarn.lock", "./"]

RUN yarn install
COPY . .

RUN apk update && apk add bash
RUN apk add --no-cache bash
RUN apk add postgresql-client

RUN chmod +x ./entrypoint.sh
ENTRYPOINT [ "/bin/bash", "./entrypoint.sh" ]
