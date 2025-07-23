# Servers 2.0 - Laravel Backend

Это Laravel API бэкэнд для системы учета серверного оборудования и информационных систем.

## Установка

1. Установите зависимости:
```bash
cd backend
composer install
```

2. Скопируйте файл окружения:
```bash
cp .env.example .env
```

3. Настройте подключение к PostgreSQL в файле `.env`:
```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=servers_db
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

4. Сгенерируйте ключ приложения:
```bash
php artisan key:generate
```

5. Выполните миграции:
```bash
php artisan migrate
```

6. Заполните базу данных тестовыми данными:
```bash
php artisan db:seed
```

7. Запустите сервер разработки:
```bash
php artisan serve
```

API будет доступно по адресу: `http://localhost:8000`

## API Endpoints

### Equipment (Оборудование)
- `GET /api/equipment` - Список оборудования
- `POST /api/equipment` - Создать оборудование
- `GET /api/equipment/{equipmentId}` - Получить оборудование
- `PUT /api/equipment/{equipmentId}` - Обновить оборудование
- `DELETE /api/equipment/{equipmentId}` - Удалить оборудование
- `GET /api/equipment-statistics` - Статистика оборудования

### Software (ПО)
- `GET /api/software` - Список ПО
- `POST /api/software` - Создать ПО
- `GET /api/software/{id}` - Получить ПО
- `PUT /api/software/{id}` - Обновить ПО
- `DELETE /api/software/{id}` - Удалить ПО

### Information Systems (ИС)
- `GET /api/information-systems` - Список ИС
- `POST /api/information-systems` - Создать ИС
- `GET /api/information-systems/{id}` - Получить ИС
- `PUT /api/information-systems/{id}` - Обновить ИС
- `DELETE /api/information-systems/{id}` - Удалить ИС

### Health Check
- `GET /api/health` - Проверка состояния API

## Структура базы данных

### Основные таблицы:
- `equipment` - Оборудование
- `equipment_storage` - Хранилища оборудования
- `equipment_ip_addresses` - IP-адреса оборудования
- `equipment_passwords` - Пароли оборудования (зашифрованы)
- `responsible_persons` - Ответственные лица
- `software` - Программное обеспечение
- `information_systems` - Информационные системы

### Связующие таблицы:
- `equipment_responsible` - Связь оборудования с ответственными
- `equipment_software` - Связь оборудования с ПО
- `equipment_information_systems` - Связь оборудования с ИС

## Особенности

1. **Шифрование паролей**: Пароли оборудования автоматически шифруются при сохранении
2. **CORS**: Настроена поддержка CORS для фронтенда
3. **Валидация**: Все входящие данные валидируются
4. **Пагинация**: Списки поддерживают пагинацию
5. **Поиск и фильтрация**: Поддержка поиска и фильтрации данных
6. **Связи**: Полная поддержка связей между сущностями

## Требования

- PHP 8.1+
- PostgreSQL 12+
- Composer
- Laravel 11