<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EquipmentController extends Controller
{
    /**
     * Display a listing of the equipment.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Equipment::with([
            'storage',
            'ipAddresses',
            'responsiblePersons',
            'software',
            'informationSystems'
        ]);

        // Фильтрация по статусу
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Фильтрация по типу
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Поиск
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                  ->orWhere('equipment_id', 'ILIKE', "%{$search}%")
                  ->orWhere('hostname', 'ILIKE', "%{$search}%")
                  ->orWhere('vmware_name', 'ILIKE', "%{$search}%");
            });
        }

        $equipment = $query->paginate($request->get('per_page', 15));

        return response()->json($equipment);
    }

    /**
     * Store a newly created equipment in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'equipment_id' => 'required|string|unique:equipment',
            'name' => 'required|string',
            'vmware_name' => 'nullable|string',
            'hostname' => 'nullable|string',
            'status' => 'required|in:в работе,выключено / не в работе,выведено из эксплуатации,удалено',
            'type' => 'required|in:Сервер,Виртуальный сервер,Сетевое оборудование,Электропитание,Система хранения',
            'parent_equipment' => 'nullable|string',
            'description' => 'nullable|string',
            'location' => 'nullable|string',
            'specifications' => 'nullable|string',
            'vmware_level' => 'nullable|string',
            'virtual_cpu' => 'nullable|integer',
            'ram' => 'nullable|string',
            'has_backup' => 'boolean',
            'last_backup_date' => 'nullable|date',
            'commissioned_date' => 'nullable|date',
            'decommissioned_date' => 'nullable|date',
            'kspd_access' => 'boolean',
            'internet_access' => 'boolean',
            'arcsight_connection' => 'boolean',
            'remote_access' => 'nullable|string',
            'internet_forwarding' => 'nullable|string',
            'listening_ports' => 'nullable|string',
            'documentation' => 'nullable|string',
            'related_tickets' => 'nullable|string',
        ]);

        $equipment = Equipment::create($validated);

        return response()->json($equipment->load([
            'storage',
            'ipAddresses',
            'responsiblePersons',
            'software',
            'informationSystems'
        ]), 201);
    }

    /**
     * Display the specified equipment.
     */
    public function show(string $equipmentId): JsonResponse
    {
        $equipment = Equipment::where('equipment_id', $equipmentId)
            ->with([
                'storage',
                'ipAddresses',
                'responsiblePersons',
                'software',
                'informationSystems',
                'passwords'
            ])
            ->firstOrFail();

        return response()->json($equipment);
    }

    /**
     * Update the specified equipment in storage.
     */
    public function update(Request $request, string $equipmentId): JsonResponse
    {
        $equipment = Equipment::where('equipment_id', $equipmentId)->firstOrFail();

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'vmware_name' => 'nullable|string',
            'hostname' => 'nullable|string',
            'status' => 'sometimes|in:в работе,выключено / не в работе,выведено из эксплуатации,удалено',
            'type' => 'sometimes|in:Сервер,Виртуальный сервер,Сетевое оборудование,Электропитание,Система хранения',
            'parent_equipment' => 'nullable|string',
            'description' => 'nullable|string',
            'location' => 'nullable|string',
            'specifications' => 'nullable|string',
            'vmware_level' => 'nullable|string',
            'virtual_cpu' => 'nullable|integer',
            'ram' => 'nullable|string',
            'has_backup' => 'boolean',
            'last_backup_date' => 'nullable|date',
            'commissioned_date' => 'nullable|date',
            'decommissioned_date' => 'nullable|date',
            'kspd_access' => 'boolean',
            'internet_access' => 'boolean',
            'arcsight_connection' => 'boolean',
            'remote_access' => 'nullable|string',
            'internet_forwarding' => 'nullable|string',
            'listening_ports' => 'nullable|string',
            'documentation' => 'nullable|string',
            'related_tickets' => 'nullable|string',
        ]);

        $equipment->update($validated);

        return response()->json($equipment->load([
            'storage',
            'ipAddresses',
            'responsiblePersons',
            'software',
            'informationSystems'
        ]));
    }

    /**
     * Remove the specified equipment from storage.
     */
    public function destroy(string $equipmentId): JsonResponse
    {
        $equipment = Equipment::where('equipment_id', $equipmentId)->firstOrFail();
        $equipment->delete();

        return response()->json(['message' => 'Equipment deleted successfully']);
    }

    /**
     * Get equipment statistics.
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => Equipment::count(),
            'by_status' => Equipment::selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status'),
            'by_type' => Equipment::selectRaw('type, count(*) as count')
                ->groupBy('type')
                ->pluck('count', 'type'),
        ];

        return response()->json($stats);
    }
}