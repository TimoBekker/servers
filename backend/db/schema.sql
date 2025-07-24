-- Таблица оборудования
CREATE TABLE equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица программного обеспечения
CREATE TABLE software (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица информационных систем
CREATE TABLE information_systems (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица ответственных лиц
CREATE TABLE responsible_persons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255)
);

-- Связующая таблица оборудования и ответственных
CREATE TABLE equipment_responsible (
    equipment_id INT REFERENCES equipment(id) ON DELETE CASCADE,
    responsible_id INT REFERENCES responsible_persons(id),
    PRIMARY KEY (equipment_id, responsible_id)
);

-- Связующая таблица оборудования и ПО
CREATE TABLE equipment_software (
    equipment_id INT REFERENCES equipment(id) ON DELETE CASCADE,
    software_id INT REFERENCES software(id),
    PRIMARY KEY (equipment_id, software_id)
);

-- Связующая таблица оборудования и ИС
CREATE TABLE equipment_information_systems (
    equipment_id INT REFERENCES equipment(id) ON DELETE CASCADE,
    information_system_id INT REFERENCES information_systems(id),
    PRIMARY KEY (equipment_id, information_system_id)
);