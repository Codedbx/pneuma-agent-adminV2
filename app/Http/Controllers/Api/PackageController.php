<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePackageRequest;
use App\Http\Requests\UpdatePackageRequest;
use App\Models\Package;
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
            'location',
            'min_price', 'max_price',
            'start_date', 'end_date',
            'sort_by', 'sort_dir',
            'per_page',
        ]);

        $packages = $this->packageService->getFilteredPackages($filters);

        return response()->json([
            'status' => 'success',
            'data'   => $packages,
        ]);
    }

    public function store(StorePackageRequest $request): JsonResponse
    {
        $package = $this->packageService->createPackage($request->validated());

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $img) {
                $package->addMedia($img)
                        ->toMediaCollection('package_images');
            }
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Package created successfully',
            'data'    => $package->load(['activities', 'media']),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $package = $this->packageService->getPackage($id);

        if (! $package) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Package not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $package->load(['activities', 'owner', 'media']),
        ]);
    }

    public function update(UpdatePackageRequest $request, int $id): JsonResponse
    {
        $package = $this->packageService->getPackage($id);

        if (! $package) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Package not found',
            ], 404);
        }

        $updated = $this->packageService->updatePackage(
            $package, $request->validated()
        );

        if ($request->hasFile('images')) {
            $updated->clearMediaCollection('package_images');
            foreach ($request->file('images') as $img) {
                $updated->addMedia($img)
                        ->toMediaCollection('package_images');
            }
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Package updated successfully',
            'data'    => $updated->load(['activities', 'media']),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $package = $this->packageService->getPackage($id);

        if (! $package) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Package not found',
            ], 404);
        }

        $this->packageService->deletePackage($package);

        return response()->json([
            'status'  => 'success',
            'message' => 'Package deleted successfully',
        ]);
    }

    // public function myPackages(): JsonResponse
    // {
    //     $packages = $this->packageService->getUserPackages(auth()->user());

    //     return response()->json([
    //         'status' => 'success',
    //         'data'   => $packages,
    //     ]);
    // }
}


// namespace App\Http\Controllers\Api;

// use App\Http\Controllers\Controller;
// use App\Http\Requests\StorePackageRequest;
// use App\Http\Requests\UpdatePackageRequest;
// use App\Models\Package;
// use App\Services\PackageService;
// use Illuminate\Http\Request;
// use Illuminate\Http\JsonResponse;

// class PackageController extends Controller
// {
//      public function __construct(
//         private PackageService $packageService
//     ) {
//         // $this->middleware('auth:sanctum')->except(['index', 'show']);
//         // $this->middleware('role:admin|agent')->only(['store', 'update', 'destroy']);
//     }

//     public function index(Request $request): JsonResponse
//     {
//         $filters = $request->only([
//             'destination', 'min_price', 'max_price', 'activities', 
//             'activity_match', 'sort_by', 'sort_dir', 'per_page'
//         ]);

//         $packages = $this->packageService->getFilteredPackages($filters);

//         return response()->json([
//             'status' => 'success',
//             'data' => $packages,
//         ]);
//     }

//     public function store(StorePackageRequest $request): JsonResponse
//     {
//         $package = $this->packageService->createPackage(
//             $request->validated(), 
//             $request->user()->id
//         );

//         $this->handleMediaUpload($request, $package);

//         return response()->json([
//             'status' => 'success',
//             'message' => 'Package created successfully',
//             'data' => $package->load(['activities', 'owner', 'media']),
//         ], 201);
//     }

//     public function show(Package $package): JsonResponse
//     {
//         return response()->json([
//             'status' => 'success',
//             'data' => $package->load([
//                 'activities.timeSlots',
//                 'owner',
//                 'media'
//             ]),
//         ]);
//     }

//     public function update(UpdatePackageRequest $request, Package $package): JsonResponse
//     {
//         $updatedPackage = $this->packageService->updatePackage(
//             $package, 
//             $request->validated()
//         );

//         $this->handleMediaUpload($request, $updatedPackage);

//         return response()->json([
//             'status' => 'success',
//             'message' => 'Package updated successfully',
//             'data' => $updatedPackage->load(['activities', 'media']),
//         ]);
//     }

//     public function destroy(Package $package): JsonResponse
//     {
//         $this->packageService->deletePackage($package);

//         return response()->json([
//             'status' => 'success',
//             'message' => 'Package deleted successfully',
//         ]);
//     }

//     private function handleMediaUpload(Request $request, Package $package): void
//     {
//         foreach (['images', 'videos'] as $collection) {
//             if ($request->hasFile($collection)) {
//                 $package->clearMediaCollection($collection);
//                 $package->addMultipleMediaFromRequest([$collection])
//                     ->each(fn($fileAdder) => $fileAdder->toMediaCollection($collection));
//             }
//         }
//     }
// }
