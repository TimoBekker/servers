<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\EquipmentState;
use App\Models\EquipmentType;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EquipmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Equipment::with([
            'equipmentType',
            'equipmentState', 
            'placement',
            'organization',
            'storage',
            'ipAddresses.vlanNet',
            'passwords',
            'responsiblePersons.responsePerson.organization',
            'installedSoftware.software',
            'informationSystems'
        ]);

        // Поиск
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('hostname', 'LIKE', "%{$search}%")
                  ->orWhere('vmware_name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Фильтр по статусу
        if ($request->has('status') && $request->status) {
            $query->whereHas('equipmentState', function($q) use ($request) {
                $q->where('name', $request->status);
            });
        }

        // Фильтр по типу
        if ($request->has('type') && $request->type) {
            $query->whereHas('equipmentType', function($q) use ($request) {
                $q->where('name', $request->type);
            });
        }

        // Пагинация
        $perPage = $request->get('per_page', 15);
        $equipment = $query->paginate($perPage);

        // Трансформация данных для совместимости с фронтендом
        $equipment->getCollection()->transform(function ($item) {
            return $this->transformEquipment($item);
        });

        return response()->json($equipment);
    }

    public function show(string $id): JsonResponse
    {
        $equipment = Equipment::with([
            'equipmentType',
            'equipmentState',
            'placement',
            'organization',
            'parentEquipment',
            'childEquipment',
            'storage',
            'ipAddresses.vlanNet',
            'passwords',
            'responsiblePersons.responsePerson.organization',
            'installedSoftware.software',
            'informationSystems',
            'openPorts.protocol',
            'documentation'
        ])->where('name', $id)->firstOrFail();

        return response()->json($this->transformEquipment($equipment));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:r_equipment,name',
            'vmware_name' => 'nullable|string|max:255',
            'hostname' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'specifications' => 'nullable|string',
            'vmware_level' => 'nullable|string',
            'virtual_cpu' => 'nullable|integer',
            'ram' => 'nullable|string',
            'has_backup' => 'boolean',
            'kspd_access' => 'boolean',
            'internet_access' => 'boolean',
            'arcsight_connection' => 'boolean',
        ]);

        $equipment = Equipment::create($validated);
        
        return response()->json($this->transformEquipment($equipment->load([
            'equipmentType',
            'equipmentState',
            'placement',
            'organization'
        ])), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $equipment = Equipment::where('name', $id)->firstOrFail();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:r_equipment,name,' . $equipment->id,
            'vmware_name' => 'nullable|string|max:255',
            'hostname' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'specifications' => 'nullable|string',
            'vmware_level' => 'nullable|string',
            'virtual_cpu' => 'nullable|integer',
            'ram' => 'nullable|string',
            'has_backup' => 'boolean',
            'kspd_access' => 'boolean',
            'internet_access' => 'boolean',
            'arcsight_connection' => 'boolean',
        ]);

        $equipment->update($validated);

        return response()->json($this->transformEquipment($equipment->load([
            'equipmentType',
            'equipmentState',
            'placement',
            'organization'
        ])));
    }

    public function destroy(string $id): JsonResponse
    {
        $equipment = Equipment::where('name', $id)->firstOrFail();
        $equipment->delete();

        return response()->json(['message' => 'Equipment deleted successfully']);
    }

    public function statistics(): JsonResponse
    {
        $total = Equipment::count();
        
        $byStatus = Equipment::join('c_state_equipment', 'r_equipment.state', '=', 'c_state_equipment.id')
            ->selectRaw('c_state_equipment.name as status, COUNT(*) as count')
            ->groupBy('c_state_equipment.name')
            ->pluck('count', 'status')
            ->toArray();

        $byType = Equipment::join('c_type_equipment', 'r_equipment.type', '=', 'c_type_equipment.id')
            ->selectRaw('c_type_equipment.name as type, COUNT(*) as count')
            ->groupBy('c_type_equipment.name')
            ->pluck('count', 'type')
            ->toArray();

        return response()->json([
            'total' => $total,
            'by_status' => $byStatus,
            'by_type' => $byType
        ]);
    }

    private function transformEquipment($equipment): array
    {
        return [
            'id' => $equipment->id,
            'equipment_id' => $equipment->name,
            'name' => $equipment->name,
            'vmware_name' => $equipment->vmware_name,
            'hostname' => $equipment->hostname,
            'status' => $equipment->equipmentState ? $equipment->equipmentState->name : 'неизвестно',
            'type' => $equipment->equipmentType ? $equipment->equipmentType->name : 'неизвестно',
            'parent_equipment' => $equipment->parentEquipment ? $equipment->parentEquipment->name : null,
            'description' => $equipment->description,
            'location' => $equipment->placement ? $equipment->placement->name : null,
            'specifications' => $equipment->specifications,
            'vmware_level' => $equipment->vmware_level,
            'virtual_cpu' => $equipment->virtual_cpu,
            'ram' => $equipment->ram,
            'has_backup' => $equipment->has_backup,
            'last_backup_date' => $equipment->last_backup_date?->format('Y-m-d'),
            'commissioned_date' => $equipment->commissioned_date?->format('Y-m-d'),
            'decommissioned_date' => $equipment->decommissioned_date?->format('Y-m-d'),
            'kspd_access' => $equipment->kspd_access,
            'internet_access' => $equipment->internet_access,
            'arcsight_connection' => $equipment->arcsight_connection,
            'remote_access' => $equipment->access_remote,
            'internet_forwarding' => $equipment->internet_forwarding,
            'listening_ports' => $equipment->listening_ports,
            'documentation' => $equipment->documentation,
            'related_tickets' => $equipment->related_tickets,
            'created_at' => $equipment->created_at?->toISOString(),
            'updated_at' => $equipment->updated_at?->toISOString(),
            
            // Связанные данные
            'storage' => $equipment->storage->map(function($storage) {
                return [
                    'id' => $storage->id,
                    'name' => $storage->name,
                    'size' => $storage->size
                ];
            }),
            
            'ip_addresses' => $equipment->ipAddresses->map(function($ip) {
                return [
                    'id' => $ip->id,
                    'ip_address' => $ip->ip_address,
                    'subnet_mask' => $ip->subnet_mask,
                    'vlan' => $ip->vlanNet ? $ip->vlanNet->name : '',
                    'dns_name' => $ip->dns_name
                ];
            }),
            
            'passwords' => $equipment->passwords->map(function($password) {
                return [
                    'id' => $password->id,
                    'username' => $password->username,
                    'password' => $password->password,
                    'description' => $password->description
                ];
            }),
            
            'responsible_persons' => $equipment->responsiblePersons->map(function($resp) {
                return [
                    'id' => $resp->id,
                    'name' => $resp->responsePerson ? $resp->responsePerson->username : '',
                    'organization' => $resp->responsePerson && $resp->responsePerson->organization 
                        ? $resp->responsePerson->organization->name : '',
                    'company' => $resp->responsePerson && $resp->responsePerson->organization 
                        ? $resp->responsePerson->organization->name : '',
                    'role' => $resp->responsibility ? $resp->responsibility->name : '',
                    'email' => $resp->responsePerson ? $resp->responsePerson->email : '',
                    'phone' => $resp->responsePerson ? $resp->responsePerson->phone : ''
                ];
            }),
            
            'software' => $equipment->installedSoftware->map(function($installed) {
                return [
                    'id' => $installed->software->id,
                    'name' => $installed->software->name,
                    'version' => $installed->software->version,
                    'vendor' => $installed->software->developer ? $installed->software->developer->name : null,
                    'description' => $installed->software->description,
                    'license_type' => $installed->software->licenseType ? $installed->software->licenseType->name : null,
                    'license_expiry' => null
                ];
            }),
            
            'information_systems' => $equipment->informationSystems->map(function($is) {
                return [
                    'id' => $is->id,
                    'name' => $is->name,
                    'description' => $is->description,
                    'status' => $is->validation ? $is->validation->name : 'неизвестно',
                    'owner' => null
                ];
            })
        ];
    }
}