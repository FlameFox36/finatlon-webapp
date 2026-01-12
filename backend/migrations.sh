#!/bin/bash
set -e  # Прерывает выполнение при любой ошибке

# Если в текущей директории есть бандл — запускаем миграции
if [ -f "./efbundle" ]; then
    echo "Применение миграций БД с помощью EF Core Bundle..."
    ./efbundle --connection "$DB_CONNECTION_STRING"
else
    echo "Файл бандла миграций (efbundle) не найден."
    exit 1
fi

# Запускаем основное приложение (передаем все аргументы командной строки)
exec "$@"