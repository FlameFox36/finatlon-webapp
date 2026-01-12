#!/bin/sh

# Ожидаем доступности базы данных
echo "Waiting for database..."
until nc -z $DB_HOST $DB_PORT; do
  sleep 2
done

echo "Database is ready! Applying migrations..."

dotnet ef database update

echo "Migrations applied successfully!"