<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePackageRequest;
use App\Http\Requests\UpdatePackageRequest;
use App\Http\Resources\PackageResource;
use App\Models\Package;
use App\Services\PackageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
        // Capture all possible filters from the request, including 'per_page'
        $filters = $request->only([
            'search',
            'destination',
            'price_min',
            'price_max',
            'date_start',
            'date_end',
            'activities',
            'sort',
            'direction',
            'per_page', 
            'page',     
        ]);

        Log::info('Package filters:', $filters);

        $packages = $this->packageService->getFilteredPackages($filters);

        // Check if no packages were found after filtering
        if ($packages->isEmpty() && $packages->total() === 0) { // Check total for true emptiness, as isEmpty() can be true even with a total if it's the last page
            return response()->json([
                'status'  => 'error',
                'message' => 'No packages found matching your criteria.', // More specific message
            ], 404);
        }


        return PackageResource::collection($packages)->response()->setStatusCode(200);
        
    }

     public function store(StorePackageRequest $request): JsonResponse
    {
        $package = $this->packageService->createPackage($request->validated());

        return response()->json([
            'status' => 'success',
            'data' => new PackageResource($package),
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $package = $this->packageService->getPackage($id);

        Log::info('Fetching package', ['id' => $id]);
        Log::info('Package details', ['package' => $package]);

        if (!$package) {
            return response()->json([
                'status' => 'error',
                'message' => 'Package not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => new PackageResource($package),
        ]);
    }

    public function update(UpdatePackageRequest $request, $id): JsonResponse
    {
        $package = $this->packageService->updatePackage($id, $request->validated());

        if (!$package) {
            return response()->json([
                'status' => 'error',
                'message' => 'Package not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => new PackageResource($package),
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $success = $this->packageService->deletePackage($id);

        if (!$success) {
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

    public function userPackages(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthenticated',
            ], 401);
        }

        $packages = $this->packageService->getUserPackages($user);

        return response()->json([
            'status' => 'success',
            'data' => PackageResource::collection($packages),
        ]);
    }

}