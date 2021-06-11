FROM node:12-alpine as node

WORKDIR /app
COPY ["package.json", "./"]

RUN yarn install
COPY . .

RUN chmod +x ./entrypoint.sh
ENTRYPOINT [ "/bin/sh", "./entrypoint.sh" ]
