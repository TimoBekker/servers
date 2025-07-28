<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EquipmentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('api')->group(function () {
    // Health check
    Route::get('/health', function () {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toISOString(),
            'service' => 'Servers 2.0 Laravel API',
            'database' => 'MariaDB'
        ]);
    });

    // Equipment routes
    Route::apiResource('equipment', EquipmentController::class);
    Route::get('equipment-statistics', [EquipmentController::class, 'statistics']);

    // Software routes (заглушки)
    Route::get('software', function () {
        return response()->json([
            'data' => [],
            'current_page' => 1,
            'last_page' => 1,
            'per_page' => 15,
            'total' => 0
        ]);
    });

    // Information Systems routes (заглушки)
    Route::get('information-systems', function () {
        return response()->json([
            'data' => [],
            'current_page' => 1,
            'last_page' => 1,
            'per_page' => 15,
            'total' => 0
        ]);
    });
});