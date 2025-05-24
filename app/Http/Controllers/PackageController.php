<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePackageRequest;
use App\Http\Requests\UpdatePackageRequest;
use App\Services\PackageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PackageController extends Controller
{
     public function __construct(
        private PackageService $packageService
    ) {
        // $this->middleware('auth:sanctum');
        // $this->middleware('role:admin|agent')->except(['index', 'show']);
    }

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'location', 'min_price', 'max_price', 'activities', 
            'activity_match', 'sort_by', 'sort_dir', 'per_page'
        ]);

        $packages = $this->packageService->getFilteredPackages($filters);

        return response()->json([
            'status' => 'success',
            'data' => $packages,
        ]);
    }

    public function store(StorePackageRequest $request): JsonResponse
    {
        $package = $this->packageService->createPackage($request->validated());

        // Handle media uploads if present
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $package->addMediaFromRequest('images')
                    ->each(function ($fileAdder) {
                        $fileAdder->toMediaCollection('images');
                    });
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Package created successfully',
            'data' => $package->load(['activities', 'media']),
        ], 201);
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
            'data' => $package->load(['activities', 'owner', 'media']),
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
            'data' => $package->load(['activities', 'media']),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->packageService->deletePackage($id);

        if (!$deleted) {
            return response()->json([
                'status' => 'error',
                'message' => 'Package not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Package deleted successfully',
        ]);
    }

    // public function myPackages(): JsonResponse
    // {
    //     $packages = $this->packageService->getPackagesByOwner(auth()->id());

    //     return response()->json([
    //         'status' => 'success',
    //         'data' => $packages,
    //     ]);
    // }
}
