#!/bin/bash

echo "Starting"

: ${POSTGRES_HOST:=db}
: ${POSTGRES_PORT:=5432}
: ${POSTGRES_DB:=FastFeet}
: ${POSTGRES_USER:=postgres}

until pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER
do
  echo "Waiting for Postgres ($POSTGRES_HOST - $POSTGRES_DB:$POSTGRES_PORT $POSTGRES_USER) to start..."
  sleep 2;
done

Starting="Container_Already_Started"

if [ ! -e $Starting ]; then
    touch $Starting
    echo "-- First container startup --"
    /bin/bash -c "yarn sequelize db:migrate && yarn sequelize db:seed:all"
else
    echo "-- Not first container startup --"
fi

/bin/bash -c "yarn dev"
