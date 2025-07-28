-- Создание таблиц для системы учета оборудования

-- Основная таблица оборудования
CREATE TABLE IF NOT EXISTS r_equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    vmware_name VARCHAR(255),
    hostname VARCHAR(255),
    status ENUM('в работе', 'выключено / не в работе', 'выведено из эксплуатации', 'удалено') DEFAULT 'в работе',
    type ENUM('Сервер', 'Виртуальный сервер', 'Сетевое оборудование', 'Электропитание', 'Система хранения') DEFAULT 'Сервер',
    parent_equipment VARCHAR(255),
    description TEXT,
    location VARCHAR(255),
    specifications TEXT,
    vmware_level VARCHAR(100),
    virtual_cpu INT,
    ram VARCHAR(100),
    has_backup BOOLEAN DEFAULT FALSE,
    last_backup_date DATE,
    commissioned_date DATE,
    decommissioned_date DATE,
    kspd_access BOOLEAN DEFAULT FALSE,
    internet_access BOOLEAN DEFAULT FALSE,
    arcsight_connection BOOLEAN DEFAULT FALSE,
    remote_access TEXT,
    internet_forwarding TEXT,
    listening_ports TEXT,
    documentation TEXT,
    related_tickets TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Таблица хранилищ оборудования
CREATE TABLE IF NOT EXISTS equipment_storage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    size VARCHAR(100) NOT NULL,
    FOREIGN KEY (equipment_id) REFERENCES r_equipment(id) ON DELETE CASCADE
);

-- Таблица IP-адресов оборудования
CREATE TABLE IF NOT EXISTS equipment_ip_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    subnet_mask VARCHAR(45),
    vlan VARCHAR(50),
    dns_name VARCHAR(255),
    FOREIGN KEY (equipment_id) REFERENCES r_equipment(id) ON DELETE CASCADE
);

-- Таблица паролей оборудования
CREATE TABLE IF NOT EXISTS equipment_passwords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (equipment_id) REFERENCES r_equipment(id) ON DELETE CASCADE
);

-- Таблица ответственных лиц
CREATE TABLE IF NOT EXISTS equipment_responsible_persons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    company VARCHAR(255),
    role VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    FOREIGN KEY (equipment_id) REFERENCES r_equipment(id) ON DELETE CASCADE
);

-- Индексы для оптимизации
CREATE INDEX idx_equipment_name ON r_equipment(name);
CREATE INDEX idx_equipment_status ON r_equipment(status);
CREATE INDEX idx_equipment_type ON r_equipment(type);
CREATE INDEX idx_equipment_hostname ON r_equipment(hostname);
CREATE INDEX idx_storage_equipment ON equipment_storage(equipment_id);
CREATE INDEX idx_ip_equipment ON equipment_ip_addresses(equipment_id);
CREATE INDEX idx_passwords_equipment ON equipment_passwords(equipment_id);
CREATE INDEX idx_responsible_equipment ON equipment_responsible_persons(equipment_id);

-- Вставка тестовых данных
INSERT IGNORE INTO r_equipment (name, vmware_name, hostname, status, type, description, location, specifications, virtual_cpu, ram, has_backup, kspd_access, internet_access) VALUES
('SRV-001', 'vm-app-server-01', 'app-server-01.local', 'в работе', 'Виртуальный сервер', 'Основной сервер приложений', 'Стойка A1, позиция 10-12', 'CPU: 4 vCPU, RAM: 16GB, Storage: 500GB SSD', 4, '16 GB', TRUE, TRUE, FALSE),
('SRV-002', 'vm-db-server-01', 'db-server-01.local', 'в работе', 'Виртуальный сервер', 'Сервер базы данных', 'Стойка A1, позиция 13-15', 'CPU: 8 vCPU, RAM: 32GB, Storage: 1TB SSD', 8, '32 GB', TRUE, TRUE, FALSE),
('NET-001', NULL, 'switch-core-01', 'в работе', 'Сетевое оборудование', 'Основной коммутатор', 'Стойка B1, позиция 1', 'Cisco Catalyst 9300, 48 портов', NULL, NULL, FALSE, FALSE, FALSE),
('UPS-001', NULL, 'ups-main-01', 'в работе', 'Электропитание', 'Основной ИБП', 'Техническое помещение', 'APC Smart-UPS 3000VA', NULL, NULL, FALSE, FALSE, FALSE);

-- Вставка тестовых IP-адресов
INSERT IGNORE INTO equipment_ip_addresses (equipment_id, ip_address, subnet_mask, vlan, dns_name) VALUES
(1, '192.168.1.10', '255.255.255.0', 'VLAN100', 'app-server-01.local'),
(2, '192.168.1.11', '255.255.255.0', 'VLAN100', 'db-server-01.local'),
(3, '192.168.1.1', '255.255.255.0', 'VLAN1', 'switch-core-01.local');

-- Вставка тестовых хранилищ
INSERT IGNORE INTO equipment_storage (equipment_id, name, size) VALUES
(1, 'System Drive', '100 GB SSD'),
(1, 'Data Drive', '400 GB SSD'),
(2, 'System Drive', '200 GB SSD'),
(2, 'Database Drive', '800 GB SSD');

-- Вставка тестовых паролей
INSERT IGNORE INTO equipment_passwords (equipment_id, username, password, description) VALUES
(1, 'admin', 'SecurePass123!', 'Административный доступ'),
(1, 'appuser', 'AppUser456!', 'Пользователь приложения'),
(2, 'root', 'DbRoot789!', 'Root доступ к БД'),
(2, 'dbadmin', 'DbAdmin012!', 'Администратор БД');