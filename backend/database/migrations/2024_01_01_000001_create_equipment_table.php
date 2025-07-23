<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();
            $table->string('equipment_id')->unique(); // SRV-001, SW-001, etc.
            $table->string('name');
            $table->string('vmware_name')->nullable();
            $table->string('hostname')->nullable();
            $table->enum('status', ['в работе', 'выключено / не в работе', 'выведено из эксплуатации', 'удалено']);
            $table->enum('type', ['Сервер', 'Виртуальный сервер', 'Сетевое оборудование', 'Электропитание', 'Система хранения']);
            $table->string('parent_equipment')->nullable();
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->text('specifications')->nullable();
            
            // Характеристики
            $table->string('vmware_level')->nullable();
            $table->integer('virtual_cpu')->nullable();
            $table->string('ram')->nullable();
            
            // Статус оборудования
            $table->boolean('has_backup')->default(false);
            $table->date('last_backup_date')->nullable();
            $table->date('commissioned_date')->nullable();
            $table->date('decommissioned_date')->nullable();
            
            // Параметры безопасности
            $table->boolean('kspd_access')->default(false);
            $table->boolean('internet_access')->default(false);
            $table->boolean('arcsight_connection')->default(false);
            $table->string('remote_access')->nullable();
            $table->string('internet_forwarding')->nullable();
            $table->text('listening_ports')->nullable();
            
            $table->text('documentation')->nullable();
            $table->text('related_tickets')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};