#!/bin/sh

echo "Starting"

Starting="CONTAINER_ALREADY_STARTED_PLACEHOLDER"

if [ ! -e $Starting ]; then
    touch $Starting
    echo "-- First container startup --"
    /bin/sh -c "yarn sequelize db:migrate && yarn sequelize db:seed:all"
else
    echo "-- Not first container startup --"
fi

/bin/sh -c  "yarn dev"
