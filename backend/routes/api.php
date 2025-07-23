<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EquipmentController;
use App\Http\Controllers\Api\SoftwareController;
use App\Http\Controllers\Api\InformationSystemController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Equipment routes
Route::apiResource('equipment', EquipmentController::class)->parameter('equipment', 'equipmentId');
Route::get('equipment-statistics', [EquipmentController::class, 'statistics']);

// Software routes
Route::apiResource('software', SoftwareController::class);

// Information Systems routes
Route::apiResource('information-systems', InformationSystemController::class);

// Health check
Route::get('health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'service' => 'Servers 2.0 API'
    ]);
});