# Структура базы данных PostgreSQL для Servers 2.0

## 📊 Основные таблицы

### 1. `equipment` - Оборудование
**Основная таблица для хранения информации об оборудовании**

| Поле | Тип | Описание | Обязательное |
|------|-----|----------|--------------|
| `id` | BIGINT | Первичный ключ | ✅ |
| `equipment_id` | VARCHAR | Уникальный ID оборудования (SRV-001, SW-001) | ✅ |
| `name` | VARCHAR | Название оборудования | ✅ |
| `vmware_name` | VARCHAR | VMware имя | ❌ |
| `hostname` | VARCHAR | Hostname | ❌ |
| `status` | ENUM | Статус: 'в работе', 'выключено / не в работе', 'выведено из эксплуатации', 'удалено' | ✅ |
| `type` | ENUM | Тип: 'Сервер', 'Виртуальный сервер', 'Сетевое оборудование', 'Электропитание', 'Система хранения' | ✅ |
| `parent_equipment` | VARCHAR | Родительское оборудование | ❌ |
| `description` | TEXT | Описание | ❌ |
| `location` | VARCHAR | Местоположение | ❌ |
| `specifications` | TEXT | Технические характеристики | ❌ |
| `vmware_level` | VARCHAR | Уровень VMware | ❌ |
| `virtual_cpu` | INTEGER | Количество виртуальных процессоров | ❌ |
| `ram` | VARCHAR | Объем ОЗУ | ❌ |
| `has_backup` | BOOLEAN | Наличие резервного копирования | ❌ |
| `last_backup_date` | DATE | Дата последнего бекапа | ❌ |
| `commissioned_date` | DATE | Дата ввода в эксплуатацию | ❌ |
| `decommissioned_date` | DATE | Дата вывода из эксплуатации | ❌ |
| `kspd_access` | BOOLEAN | Доступ в КСПД | ❌ |
| `internet_access` | BOOLEAN | Доступ в интернет | ❌ |
| `arcsight_connection` | BOOLEAN | Подключение к Arcsight | ❌ |
| `remote_access` | VARCHAR | Удаленный доступ | ❌ |
| `internet_forwarding` | VARCHAR | Проброс в интернет | ❌ |
| `listening_ports` | TEXT | Прослушиваемые порты | ❌ |
| `documentation` | TEXT | Документация | ❌ |
| `related_tickets` | TEXT | Связанные тикеты | ❌ |
| `created_at` | TIMESTAMP | Дата создания | ✅ |
| `updated_at` | TIMESTAMP | Дата обновления | ✅ |

### 2. `equipment_storage` - Хранилища оборудования
**Связанная таблица для хранения информации о дисках/хранилищах**

| Поле | Тип | Описание | Обязательное |
|------|-----|----------|--------------|
| `id` | BIGINT | Первичный ключ | ✅ |
| `equipment_id` | BIGINT | Внешний ключ на equipment | ✅ |
| `name` | VARCHAR | Название диска (HDD1, HDD2) | ✅ |
| `size` | VARCHAR | Размер (50 Gb, 10 Gb) | ✅ |
| `created_at` | TIMESTAMP | Дата создания | ✅ |
| `updated_at` | TIMESTAMP | Дата обновления | ✅ |

### 3. `equipment_ip_addresses` - IP-адреса оборудования
**Связанная таблица для хранения сетевых настроек**

| Поле | Тип | Описание | Обязательное |
|------|-----|----------|--------------|
| `id` | BIGINT | Первичный ключ | ✅ |
| `equipment_id` | BIGINT | Внешний ключ на equipment | ✅ |
| `ip_address` | VARCHAR | IP-адрес | ✅ |
| `subnet_mask` | VARCHAR | Маска подсети | ✅ |
| `vlan` | VARCHAR | VLAN | ✅ |
| `dns_name` | VARCHAR | DNS имя | ❌ |
| `created_at` | TIMESTAMP | Дата создания | ✅ |
| `updated_at` | TIMESTAMP | Дата обновления | ✅ |

### 4. `equipment_passwords` - Пароли оборудования
**Связанная таблица для хранения учетных данных (зашифрованы)**

| Поле | Тип | Описание | Обязательное |
|------|-----|----------|--------------|
| `id` | BIGINT | Первичный ключ | ✅ |
| `equipment_id` | BIGINT | Внешний ключ на equipment | ✅ |
| `username` | VARCHAR | Имя пользователя | ✅ |
| `password` | VARCHAR | Пароль (зашифрован) | ✅ |
| `description` | TEXT | Описание | ❌ |
| `created_at` | TIMESTAMP | Дата создания | ✅ |
| `updated_at` | TIMESTAMP | Дата обновления | ✅ |

### 5. `responsible_persons` - Ответственные лица
**Справочник ответственных за оборудование**

| Поле | Тип | Описание | Обязательное |
|------|-----|----------|--------------|
| `id` | BIGINT | Первичный ключ | ✅ |
| `name` | VARCHAR | ФИО | ✅ |
| `organization` | VARCHAR | Организация | ✅ |
| `company` | VARCHAR | Компания | ✅ |
| `role` | VARCHAR | Роль/должность | ✅ |
| `email` | VARCHAR | Email | ✅ |
| `phone` | VARCHAR | Телефон | ✅ |
| `created_at` | TIMESTAMP | Дата создания | ✅ |
| `updated_at` | TIMESTAMP | Дата обновления | ✅ |

### 6. `software` - Программное обеспечение
**Справочник программного обеспечения**

| Поле | Тип | Описание | Обязательное |
|------|-----|----------|--------------|
| `id` | BIGINT | Первичный ключ | ✅ |
| `name` | VARCHAR | Название ПО | ✅ |
| `version` | VARCHAR | Версия | ❌ |
| `vendor` | VARCHAR | Производитель | ❌ |
| `description` | TEXT | Описание | ❌ |
| `license_type` | VARCHAR | Тип лицензии | ❌ |
| `license_expiry` | DATE | Срок действия лицензии | ❌ |
| `created_at` | TIMESTAMP | Дата создания | ✅ |
| `updated_at` | TIMESTAMP | Дата обновления | ✅ |

### 7. `information_systems` - Информационные системы
**Справочник информационных систем**

| Поле | Тип | Описание | Обязательное |
|------|-----|----------|--------------|
| `id` | BIGINT | Первичный ключ | ✅ |
| `name` | VARCHAR | Название ИС | ✅ |
| `description` | TEXT | Описание | ❌ |
| `status` | ENUM | Статус: 'активна', 'неактивна', 'в разработке', 'выведена из эксплуатации' | ✅ |
| `owner` | VARCHAR | Владелец | ❌ |
| `created_at` | TIMESTAMP | Дата создания | ✅ |
| `updated_at` | TIMESTAMP | Дата обновления | ✅ |

## 🔗 Связующие таблицы (Many-to-Many)

### 8. `equipment_responsible` - Связь оборудования с ответственными
| Поле | Тип | Описание |
|------|-----|----------|
| `id` | BIGINT | Первичный ключ |
| `equipment_id` | BIGINT | Внешний ключ на equipment |
| `responsible_person_id` | BIGINT | Внешний ключ на responsible_persons |
| `created_at` | TIMESTAMP | Дата создания |
| `updated_at` | TIMESTAMP | Дата обновления |

### 9. `equipment_software` - Связь оборудования с ПО
| Поле | Тип | Описание |
|------|-----|----------|
| `id` | BIGINT | Первичный ключ |
| `equipment_id` | BIGINT | Внешний ключ на equipment |
| `software_id` | BIGINT | Внешний ключ на software |
| `installed_date` | DATE | Дата установки |
| `created_at` | TIMESTAMP | Дата создания |
| `updated_at` | TIMESTAMP | Дата обновления |

### 10. `equipment_information_systems` - Связь оборудования с ИС
| Поле | Тип | Описание |
|------|-----|----------|
| `id` | BIGINT | Первичный ключ |
| `equipment_id` | BIGINT | Внешний ключ на equipment |
| `information_system_id` | BIGINT | Внешний ключ на information_systems |
| `created_at` | TIMESTAMP | Дата создания |
| `updated_at` | TIMESTAMP | Дата обновления |

## 🔐 Безопасность

### Шифрование паролей
- Пароли в таблице `equipment_passwords` автоматически шифруются при сохранении
- Используется Laravel Crypt для симметричного шифрования
- Пароли расшифровываются только при получении через API

### Индексы
- Уникальный индекс на `equipment.equipment_id`
- Индексы на внешние ключи для быстрых JOIN операций
- Индексы на поля для поиска (name, hostname, vmware_name)

## 📡 API Endpoints

### Equipment
- `GET /api/equipment` - Список с пагинацией, поиском, фильтрацией
- `POST /api/equipment` - Создание нового оборудования
- `GET /api/equipment/{equipment_id}` - Детали оборудования со всеми связями
- `PUT /api/equipment/{equipment_id}` - Обновление оборудования
- `DELETE /api/equipment/{equipment_id}` - Удаление оборудования
- `GET /api/equipment-statistics` - Статистика по статусам и типам

### Software
- `GET /api/software` - Список ПО с пагинацией и поиском
- `POST /api/software` - Создание нового ПО
- `GET /api/software/{id}` - Детали ПО
- `PUT /api/software/{id}` - Обновление ПО
- `DELETE /api/software/{id}` - Удаление ПО

### Information Systems
- `GET /api/information-systems` - Список ИС с пагинацией и поиском
- `POST /api/information-systems` - Создание новой ИС
- `GET /api/information-systems/{id}` - Детали ИС
- `PUT /api/information-systems/{id}` - Обновление ИС
- `DELETE /api/information-systems/{id}` - Удаление ИС

### System
- `GET /api/health` - Проверка состояния API

## 🚀 Особенности реализации

1. **Eloquent Relations** - Все связи настроены через Eloquent ORM
2. **Валидация** - Полная валидация входящих данных
3. **CORS** - Настроена поддержка CORS для фронтенда
4. **Пагинация** - Все списки поддерживают пагинацию
5. **Поиск** - Полнотекстовый поиск по ключевым полям
6. **Фильтрация** - Фильтрация по статусу, типу и другим полям
7. **Сиды** - Тестовые данные для разработки