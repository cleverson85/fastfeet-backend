FROM node:12-alpine as node

WORKDIR /app
COPY ["package*.json", "./"]

RUN npm install
COPY . .

RUN chmod +x ./entrypoint.sh
ENTRYPOINT [ "/bin/sh", "./entrypoint.sh" ]
