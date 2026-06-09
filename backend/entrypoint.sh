#!/bin/sh
# entrypoint.sh

echo "DB_SECRET_JSON exist? -> $DB_SECRET_JSON"
if [ -n "$DB_SECRET_JSON" ]; then
  export DB_USERNAME=$(echo "$DB_SECRET_JSON" | jq -r '.username')
  export DB_PASSWORD=$(echo "$DB_SECRET_JSON" | jq -r '.password')
fi
exec java -jar /app/app.jar "$@"
