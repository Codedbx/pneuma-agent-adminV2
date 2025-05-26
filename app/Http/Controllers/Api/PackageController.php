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
        $filters = $request->only([
            'location',
            'min_price', 'max_price',
            'start_date', 'end_date',
            'sort_by', 'sort_dir',
            'search_title',
            'activities', 'activity_match',
            'per_page',
        ]);

        $packages = $this->packageService->getFilteredPackages($filters);

    if ($packages->isEmpty()) {
        return response()->json([
            'status'  => 'error',
            'message' => 'No packages found',
        ], 404);
    }

        return response()->json([
            'status' => 'success',
            'data' => PackageResource::collection($packages),
            'meta' => [
                'current_page' => $packages->currentPage(),
                'last_page' => $packages->lastPage(),
                'total' => $packages->total(),
                'per_page' => $packages->perPage(),
                'from' => $packages->firstItem(),
                'to' => $packages->lastItem(),
            ],
            'links' => [
                'next_page_url' => $packages->nextPageUrl(),
                'prev_page_url' => $packages->previousPageUrl(),
            ]
        ]);
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