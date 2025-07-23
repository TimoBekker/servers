<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Software;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SoftwareController extends Controller
{
    /**
     * Display a listing of the software.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Software::with('equipment');

        // Поиск
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                  ->orWhere('vendor', 'ILIKE', "%{$search}%")
                  ->orWhere('version', 'ILIKE', "%{$search}%");
            });
        }

        $software = $query->paginate($request->get('per_page', 15));

        return response()->json($software);
    }

    /**
     * Store a newly created software in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'version' => 'nullable|string',
            'vendor' => 'nullable|string',
            'description' => 'nullable|string',
            'license_type' => 'nullable|string',
            'license_expiry' => 'nullable|date',
        ]);

        $software = Software::create($validated);

        return response()->json($software->load('equipment'), 201);
    }

    /**
     * Display the specified software.
     */
    public function show(Software $software): JsonResponse
    {
        return response()->json($software->load('equipment'));
    }

    /**
     * Update the specified software in storage.
     */
    public function update(Request $request, Software $software): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'version' => 'nullable|string',
            'vendor' => 'nullable|string',
            'description' => 'nullable|string',
            'license_type' => 'nullable|string',
            'license_expiry' => 'nullable|date',
        ]);

        $software->update($validated);

        return response()->json($software->load('equipment'));
    }

    /**
     * Remove the specified software from storage.
     */
    public function destroy(Software $software): JsonResponse
    {
        $software->delete();

        return response()->json(['message' => 'Software deleted successfully']);
    }
}