<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Equipment;
use App\Models\ResponsiblePerson;
use App\Models\Software;
use App\Models\InformationSystem;
use App\Models\EquipmentStorage;
use App\Models\EquipmentIpAddress;
use App\Models\EquipmentPassword;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create responsible persons
        $responsible1 = ResponsiblePerson::create([
            'name' => 'Кравченко Максим',
            'organization' => 'Цифровой регион',
            'company' => 'IT-Universe',
            'role' => 'Ответственный за консультирование и ведение проекта',
            'email' => 'kravchenko.m@it-universe.ru',
            'phone' => '+7 846 979 8080, +7 960 813 4440',
        ]);

        $responsible2 = ResponsiblePerson::create([
            'name' => 'Белов Никита',
            'organization' => 'Цифровой регион',
            'company' => 'Цифровой регион',
            'role' => 'Ответственный за администрирование ОС и ПО',
            'email' => 'n.belov@rcu.samregion.ru',
            'phone' => '903',
        ]);

        $responsible3 = ResponsiblePerson::create([
            'name' => 'Мальцев Андрей',
            'organization' => 'Цифровой регион',
            'company' => 'Цифровой регион',
            'role' => 'Ответственный за администрирование ОС и ПО',
            'email' => 'a.maltsev@digitalreg.ru',
            'phone' => '901',
        ]);

        // Create software
        $software1 = Software::create([
            'name' => 'Apache Tomcat',
            'version' => '8',
            'vendor' => 'Apache Software Foundation',
            'description' => 'Java servlet container',
        ]);

        // Create information system
        $is1 = InformationSystem::create([
            'name' => 'Тестовый контур ГИС СО "СМЭВ"',
            'description' => 'Система межведомственного электронного взаимодействия',
            'status' => 'неактивна',
            'owner' => 'Цифровой регион',
        ]);

        // Create equipment
        $equipment1 = Equipment::create([
            'equipment_id' => 'SRV-001',
            'name' => 'Сервер DB-01',
            'vmware_name' => 'SMEV3-GIS-APP-03-T',
            'hostname' => 'smev3-node1',
            'status' => 'выключено / не в работе',
            'type' => 'Виртуальный сервер',
            'parent_equipment' => 'vc7cloud.guso.loc',
            'description' => 'Узел 1 тестового СМЭВ 3.0 отключено 21.09.2023',
            'vmware_level' => '4 x 1',
            'virtual_cpu' => 4,
            'ram' => '16Gb (16384 Mb)',
            'has_backup' => false,
            'commissioned_date' => '2016-02-09',
            'kspd_access' => true,
            'internet_access' => true,
            'arcsight_connection' => false,
        ]);

        // Add storage for equipment
        EquipmentStorage::create([
            'equipment_id' => $equipment1->id,
            'name' => 'HDD1',
            'size' => '50 Gb',
        ]);

        EquipmentStorage::create([
            'equipment_id' => $equipment1->id,
            'name' => 'HDD2',
            'size' => '10 Gb',
        ]);

        // Add IP addresses
        EquipmentIpAddress::create([
            'equipment_id' => $equipment1->id,
            'ip_address' => '10.0.87.218',
            'subnet_mask' => '/23 (255.255.254.0)',
            'vlan' => '979 (Серверы РЦУП (Самара))',
            'dns_name' => 'SMEV3-APP03T.tech.samregion.ru',
        ]);

        EquipmentIpAddress::create([
            'equipment_id' => $equipment1->id,
            'ip_address' => '10.100.10.250',
            'subnet_mask' => '/27 (255.255.255.224)',
            'vlan' => '2241vlan_SMEV3_10.100-TEST (/27)',
            'dns_name' => '',
        ]);

        // Add passwords
        EquipmentPassword::create([
            'equipment_id' => $equipment1->id,
            'username' => 'devel',
            'password' => 'dev_password_123',
            'description' => 'Описание не задано',
        ]);

        EquipmentPassword::create([
            'equipment_id' => $equipment1->id,
            'username' => 'root',
            'password' => 'root_password_456',
            'description' => 'm.iseckiy',
        ]);

        // Associate with responsible persons
        $equipment1->responsiblePersons()->attach([$responsible1->id, $responsible2->id, $responsible3->id]);

        // Associate with software
        $equipment1->software()->attach($software1->id, ['installed_date' => '2016-02-09']);

        // Associate with information systems
        $equipment1->informationSystems()->attach($is1->id);

        // Create more sample equipment
        $equipment2 = Equipment::create([
            'equipment_id' => 'SW-001',
            'name' => 'Коммутатор Core-01',
            'status' => 'в работе',
            'type' => 'Сетевое оборудование',
            'location' => 'Стойка A2',
            'specifications' => '48 портов Gigabit, 4x 10GB SFP+',
            'commissioned_date' => '2020-01-15',
            'kspd_access' => true,
            'internet_access' => false,
            'arcsight_connection' => true,
        ]);

        $equipment3 = Equipment::create([
            'equipment_id' => 'UPS-001',
            'name' => 'ИБП Rack-01',
            'status' => 'выключено / не в работе',
            'type' => 'Электропитание',
            'location' => 'Стойка A1',
            'specifications' => '3000VA, Online, 8 розеток',
            'commissioned_date' => '2019-06-10',
            'has_backup' => false,
        ]);

        $equipment4 = Equipment::create([
            'equipment_id' => 'SRV-002',
            'name' => 'Сервер Legacy-01',
            'status' => 'выведено из эксплуатации',
            'type' => 'Сервер',
            'location' => 'Склад',
            'specifications' => 'Intel Pentium 4, 4GB RAM, 500GB HDD',
            'commissioned_date' => '2010-03-20',
            'decommissioned_date' => '2023-12-01',
        ]);
    }
}