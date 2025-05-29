<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePackageRequest;
use App\Http\Requests\UpdatePackageRequest;
use App\Services\PackageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PackageController extends Controller
{
    public function __construct(
        private PackageService $packageService,
        private ActivityService $activityService
    ) {
        $this->authorizeResource(Package::class, 'package');
    }

    /**
     * Display a listing of the packages.
     */
    public function index(Request $request)
    {
        $filters = $request->only([
            'search', 'destination', 'price_min', 'price_max', 
            'date_start', 'date_end', 'activities'
        ]);
        
        if ($request->has('owner') && $request->user()->hasRole(['agent', 'admin'])) {
            $packages = $this->packageService->getUserPackages(Auth::user());
        } else {
            $packages = $this->packageService->getFilteredPackages($filters);
        }

        return Inertia::render('Packages/Index', [
            'packages' => $packages,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new package.
     */
    public function create()
    {
        $activities = [];
        
        if (Auth::user()->hasRole('agent')) {
            $activities = $this->activityService->getAgentActivities(Auth::id());
        } else if (Auth::user()->hasRole('admin')) {
            $activities = $this->activityService->getAllActivities();
        }
        
        return Inertia::render('Packages/Create', [
            'activities' => $activities,
        ]);
    }

    /**
     * Store a newly created package in storage.
     */
    public function store(StorePackageRequest $request)
    {
        $package = $this->packageService->createPackage($request->validated());

        if ($request->hasFile('package_images')) {
            foreach ($request->file('package_images') as $image) {
                $package->addMedia($image)->toMediaCollection('package_images');
            }
        }

        if ($request->hasFile('package_video')) {
            $package->addMedia($request->file('package_video'))->toMediaCollection('package_videos');
        }

        return redirect()->route('packages.show', $package)
            ->with('success', 'Package created successfully.');
    }

    /**
     * Display the specified package.
     */
    public function show(Package $package)
    {
        $package->load(['activities.activity', 'owner']);
        $totalPrice = $this->packageService->calculateTotalPrice($package);
        
        return Inertia::render('Packages/Show', [
            'package' => $package,
            'totalPrice' => $totalPrice,
            'images' => $package->getMedia('package_images')->map(function ($media) {
                return [
                    'id' => $media->id,
                    'url' => $media->getUrl(),
                    'thumbnail' => $media->getUrl('thumb'),
                ];
            }),
            'video' => $package->getFirstMedia('package_videos') ? [
                'id' => $package->getFirstMedia('package_videos')->id,
                'url' => $package->getFirstMedia('package_videos')->getUrl(),
            ] : null,
        ]);
    }

    /**
     * Show the form for editing the specified package.
     */
    public function edit(Package $package)
    {
        $package->load('activities.activity');
        
        $activities = [];
        if (Auth::user()->hasRole('agent')) {
            $activities = $this->activityService->getAgentActivities(Auth::id());
        } else if (Auth::user()->hasRole('admin')) {
            $activities = $this->activityService->getAllActivities();
        }
        
        return Inertia::render('Packages/Edit', [
            'package' => $package,
            'activities' => $activities,
            'images' => $package->getMedia('package_images')->map(function ($media) {
                return [
                    'id' => $media->id,
                    'url' => $media->getUrl(),
                    'thumbnail' => $media->getUrl('thumb'),
                ];
            }),
            'video' => $package->getFirstMedia('package_videos') ? [
                'id' => $package->getFirstMedia('package_videos')->id,
                'url' => $package->getFirstMedia('package_videos')->getUrl(),
            ] : null,
        ]);
    }

    /**
     * Update the specified package in storage.
     */
    public function update(UpdatePackageRequest $request, Package $package)
    {
        $package = $this->packageService->updatePackage($package->id, $request->validated());

        if ($request->hasFile('package_images')) {
            foreach ($request->file('package_images') as $image) {
                $package->addMedia($image)->toMediaCollection('package_images');
            }
        }

        if ($request->hasFile('package_video')) {
            // Remove existing video if it exists
            if ($package->getFirstMedia('package_videos')) {
                $package->getFirstMedia('package_videos')->delete();
            }
            $package->addMedia($request->file('package_video'))->toMediaCollection('package_videos');
        }

        if ($request->has('delete_media') && is_array($request->delete_media)) {
            foreach ($request->delete_media as $mediaId) {
                $media = $package->media()->find($mediaId);
                if ($media) {
                    $media->delete();
                }
            }
        }

        return redirect()->route('packages.show', $package)
            ->with('success', 'Package updated successfully.');
    }

    /**
     * Remove the specified package from storage.
     */
    public function destroy(Package $package)
    {
        $this->packageService->deletePackage($package->id);
        
        return redirect()->route('packages.index')
            ->with('success', 'Package deleted successfully.');
    }

    /**
     * Toggle the featured status of a package.
     */
    public function toggleFeatured(Package $package)
    {
        $this->authorize('update', $package);
        
        $package->is_featured = !$package->is_featured;
        $package->save();
        
        return back()->with('success', 'Package featured status updated.');
    }

    /**
     * Toggle the active status of a package.
     */
    public function toggleActive(Package $package)
    {
        $this->authorize('update', $package);
        
        $package->is_active = !$package->is_active;
        $package->save();
        
        return back()->with('success', 'Package active status updated.');
    }
}
