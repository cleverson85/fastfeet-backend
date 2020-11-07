FROM node:12 as node

WORKDIR /usr/src/app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install
COPY . .

EXPOSE 5555

CMD ["yarn", "dev"]
