#!/bin/sh
# entrypoint.sh
if [ -n "$DB_SECRET_JSON" ]; then
  export DB_USERNAME=$(echo "$DB_SECRET_JSON" | python3 -c "..." -r '.username')
  export DB_PASSWORD=$(echo "$DB_SECRET_JSON" | python3 -c "..." -r '.password')
fi
exec java -jar /app/app.jar "$@"