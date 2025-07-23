<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InformationSystem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class InformationSystemController extends Controller
{
    /**
     * Display a listing of the information systems.
     */
    public function index(Request $request): JsonResponse
    {
        $query = InformationSystem::with('equipment');

        // Фильтрация по статусу
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Поиск
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                  ->orWhere('description', 'ILIKE', "%{$search}%")
                  ->orWhere('owner', 'ILIKE', "%{$search}%");
            });
        }

        $systems = $query->paginate($request->get('per_page', 15));

        return response()->json($systems);
    }

    /**
     * Store a newly created information system in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'status' => 'required|in:активна,неактивна,в разработке,выведена из эксплуатации',
            'owner' => 'nullable|string',
        ]);

        $system = InformationSystem::create($validated);

        return response()->json($system->load('equipment'), 201);
    }

    /**
     * Display the specified information system.
     */
    public function show(InformationSystem $informationSystem): JsonResponse
    {
        return response()->json($informationSystem->load('equipment'));
    }

    /**
     * Update the specified information system in storage.
     */
    public function update(Request $request, InformationSystem $informationSystem): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:активна,неактивна,в разработке,выведена из эксплуатации',
            'owner' => 'nullable|string',
        ]);

        $informationSystem->update($validated);

        return response()->json($informationSystem->load('equipment'));
    }

    /**
     * Remove the specified information system from storage.
     */
    public function destroy(InformationSystem $informationSystem): JsonResponse
    {
        $informationSystem->delete();

        return response()->json(['message' => 'Information system deleted successfully']);
    }
}