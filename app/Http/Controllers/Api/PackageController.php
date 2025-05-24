<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePackageRequest;
use App\Services\PackageService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PackageController extends Controller
{
    public function __construct(
        private PackageService $packageService
    ) {
        $this->middleware('auth:sanctum');
        $this->middleware('role:admin|agent')->except(['index', 'show']);
    }

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'location', 'min_price', 'max_price', 'activities', 
            'activity_match', 'sort_by', 'sort_dir', 'per_page'
        ]);

        $packages = $this->packageService->filterPackages($filters);

        return response()->json([
            'status' => 'success',
            'data' => $packages,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
       
    }

    public function show(int $id): JsonResponse
    {
        $package = $this->packageService->getPackage($id);

        if (!$package) {
            return response()->json([
                'status' => 'error',
                'message' => 'Package not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $package->load(['activities', 'addon', 'owner', 'media']),
        ]);
    }

    public function update(UpdatePackageRequest $request, int $id): JsonResponse
    {
        $package = $this->packageService->updatePackage($id, $request->validated());

        // Handle media uploads if present
        if ($request->hasFile('images')) {
            $package->clearMediaCollection('images');
            foreach ($request->file('images') as $image) {
                $package->addMediaFromRequest('images')
                    ->each(function ($fileAdder) {
                        $fileAdder->toMediaCollection('images');
                    });
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Package updated successfully',
            'data' => $package->load(['activities', 'addon', 'media']),
        ]);
    }

}
