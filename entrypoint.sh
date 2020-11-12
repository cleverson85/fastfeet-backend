CONTAINER_ALREADY_STARTED="CONTAINER_ALREADY_STARTED_PLACEHOLDER"

if [ ! -e $CONTAINER_ALREADY_STARTED ]; then
    touch $CONTAINER_ALREADY_STARTED
    echo "-- First container startup --"
    /bin/sh -c "yarn sequelize db:migrate && yarn sequelize db:seed:all"
else
    echo "-- Not first container startup --"
fi

/bin/sh -c  "yarn dev"