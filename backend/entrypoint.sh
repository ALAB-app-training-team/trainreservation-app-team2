#!/bin/sh

echo "DB_SECRET_JSON exist? -> $DB_SECRET_JSON"
echo "Parsed:"
echo "$DB_SECRET_JSON" | jq .
echo "Password"
echo "$DB_SECRET_JSON" | jq -r '.password'
if [ -n "$DB_SECRET_JSON" ]; then
  export DB_USERNAME=$(echo "$DB_SECRET_JSON" | jq -r '.username')
  export DB_PASSWORD=$(echo "$DB_SECRET_JSON" | jq -r '.password')
fi
exec java -jar /app/app.jar "$@"
