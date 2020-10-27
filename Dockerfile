FROM postgres:latest

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=docker
ENV POSTGRES_DB=FastFeet

LABEL version="1.0.0" description="Fast Feet Back-End" maintainer="Cleverson Queiroz"

VOLUME /fastfeet_db

EXPOSE 5432

FROM node:12

RUN mkdir source

WORKDIR /source
COPY . ./source

RUN npm install

RUN npm sequelize db:migrate
RUN npm sequelize db:seed:all

RUN npm build

EXPOSE 5555
CMD npm-run-all -p
