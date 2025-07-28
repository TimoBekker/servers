# Структура MariaDB базы данных

## Основные таблицы

### 📊 Оборудование (r_equipment)
- `id` - первичный ключ
- `name` - название оборудования (используется как equipment_id)
- `vmware_name` - имя в VMware
- `hostname` - сетевое имя
- `state` - состояние (FK -> c_state_equipment)
- `type` - тип оборудования (FK -> c_type_equipment)
- `parent` - родительское оборудование (FK -> r_equipment)
- `description` - описание
- `placement` - размещение (FK -> s_placement)
- `organization` - организация (FK -> s_organization)
- `specifications` - технические характеристики
- `vmware_level` - уровень VMware
- `virtual_cpu` - количество виртуальных CPU
- `ram` - оперативная память
- `has_backup` - наличие резервного копирования
- `last_backup_date` - дата последнего бэкапа
- `commissioned_date` - дата ввода в эксплуатацию
- `decommissioned_date` - дата вывода из эксплуатации
- `kspd_access` - доступ к КСПД
- `internet_access` - доступ в интернет
- `arcsight_connection` - подключение к ArcSight
- `access_remote` - удаленный доступ (FK -> s_variant_access_remote)
- `internet_forwarding` - проброс в интернет
- `listening_ports` - прослушиваемые порты
- `documentation` - документация
- `related_tickets` - связанные заявки

### 💾 Хранилища (c_volume_hdd)
- `id` - первичный ключ
- `equipment` - оборудование (FK -> r_equipment)
- `name` - название хранилища
- `size` - размер

### 🌐 IP-адреса (nn_equipment_vlan)
- `id` - первичный ключ
- `equipment` - оборудование (FK -> r_equipment)
- `vlan_net` - VLAN сеть (FK -> c_vlan_net)
- `ip_address` - IP-адрес
- `subnet_mask` - маска подсети
- `dns_name` - DNS имя

### 🔐 Пароли (r_password)
- `id` - первичный ключ
- `equipment` - оборудование (FK -> r_equipment)
- `information_system` - ИС (FK -> r_information_system)
- `username` - имя пользователя
- `password` - пароль (зашифрован)
- `description` - описание
- `next` - следующий пароль (FK -> r_password)

### 👥 Ответственные за оборудование (s_response_equipment)
- `id` - первичный ключ
- `equipment` - оборудование (FK -> r_equipment)
- `responsibility` - тип ответственности (FK -> c_variant_responsibility)
- `response_person` - ответственное лицо (FK -> user)
- `legal_doc` - правовой документ (FK -> r_legal_doc)

### 👤 Пользователи (user)
- `id` - первичный ключ
- `username` - имя пользователя
- `email` - электронная почта
- `phone` - телефон
- `organization` - организация (FK -> s_organization)
- `leader` - руководитель (FK -> user)

### 🏢 Организации (s_organization)
- `id` - первичный ключ
- `name` - название
- `description` - описание
- `parent` - родительская организация (FK -> s_organization)

### 💻 Программное обеспечение (r_software)
- `id` - первичный ключ
- `name` - название
- `version` - версия
- `description` - описание
- `type` - тип ПО (FK -> c_type_software)
- `type_license` - тип лицензии (FK -> c_type_license)
- `owner` - владелец (FK -> s_organization)
- `method_license` - метод лицензирования (FK -> c_method_license)
- `developer` - разработчик (FK -> s_organization)

### 🖥️ Установленное ПО (r_software_installed)
- `id` - первичный ключ
- `software` - ПО (FK -> r_software)
- `equipment` - оборудование (FK -> r_equipment)

### 🏛️ Информационные системы (r_information_system)
- `id` - первичный ключ
- `name` - название
- `description` - описание
- `validation` - валидация (FK -> c_variant_validation)
- `privacy` - уровень конфиденциальности (FK -> c_level_privacy)
- `protection` - уровень защиты (FK -> c_level_protection)

## Справочники (c_*)

### Типы и состояния оборудования
- `c_type_equipment` - типы оборудования
- `c_state_equipment` - состояния оборудования

### Сетевые настройки
- `c_vlan_net` - VLAN сети
- `c_protocol` - протоколы

### Программное обеспечение
- `c_type_software` - типы ПО
- `c_type_license` - типы лицензий
- `c_method_license` - методы лицензирования

### Безопасность и доступ
- `c_variant_responsibility` - варианты ответственности
- `c_variant_validation` - варианты валидации
- `c_level_privacy` - уровни конфиденциальности
- `c_level_protection` - уровни защиты
- `c_type_access_remote` - типы удаленного доступа

## Связующие таблицы (nn_*)

- `nn_equipment_infosys_contour` - связь оборудования с ИС
- `nn_is_software` - связь ИС с ПО
- `nn_equipment_claim` - связь оборудования с заявками
- `nn_event_equipment` - связь событий с оборудованием
- `nn_event_is` - связь событий с ИС

## Дополнительные таблицы

### Документооборот
- `r_documentation` - документация
- `r_legal_doc` - правовые документы
- `r_contract` - контракты

### События и заявки
- `r_event` - события
- `s_claim` - заявки

### Размещение и инфраструктура
- `s_placement` - размещение
- `s_open_port` - открытые порты

## Особенности интеграции

1. **Совместимость с фронтендом**: Модели адаптированы для работы с существующим React интерфейсом
2. **Автоматическое шифрование**: Пароли автоматически шифруются/расшифровываются
3. **Связи**: Настроены все необходимые Eloquent отношения
4. **Трансформация данных**: API возвращает данные в формате, ожидаемом фронтендом
5. **Поиск и фильтрация**: Поддержка поиска по нескольким полям и фильтрации