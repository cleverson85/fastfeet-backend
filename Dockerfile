FROM node:12-alpine as node

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install

COPY . .

EXPOSE 5555

ENTRYPOINT [ "/bin/sh", "./entrypoint.sh" ]

# RUN /bin/sh -c "yarn sequelize db:migrate && yarn sequelize db:seed:all"

# CMD [ "yarn", "dev" ]
