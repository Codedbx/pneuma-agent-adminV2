<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePackageRequest;
use App\Http\Requests\UpdatePackageRequest;
use App\Http\Resources\PackageResource;
use App\Models\Activity;
use App\Models\Package;
use App\Services\PackageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PackageController extends Controller
{
    public function __construct(
        private PackageService $packageService
    ) {
    }

    /**
     * Display a listing of the packages.
     */
    public function index(Request $request)
    {
        $incoming = $request->only([
            'search',
            'destination',
            'price_min',
            'price_max',
            'date_start',
            'date_end',
            'activities',
            'sort',
            'direction',
        ]);

        $defaults = [
            'search'      => '',
            'destination' => '',
            'price_min'   => '',
            'price_max'   => '',
            'date_start'  => '',
            'date_end'    => '',
            'activities'  => '',
            'sort'        => 'title',
            'direction'   => 'asc',
        ];

        $filters = array_merge($defaults, $incoming);
        $packages = $this->packageService->getFilteredPackages($filters);

        return Inertia::render("packages/index", [
            'packages' => $packages,
            'filters'  => $filters,
        ]);
    }

    /**
     * Show the form for creating a new package.
     */
    public function create()
    {
        $activities = Activity::all();
        
        // if (Auth::user()->hasRole('agent')) {
        //     $activities = $this->activityService->getAgentActivities(Auth::id());
        // } else if (Auth::user()->hasRole('admin')) {
        //     $activities = $this->activityService->getAllActivities();
        // }
        
        return Inertia::render('packages/createPackage', [
            'activities' => $activities,
        ]);
    }

    /**
     * Store a newly created package in storage.
     */
    public function store(StorePackageRequest $request)
    {
        $package = $this->packageService->createPackage($request->validated());

        Log::info('Package created', [
            'user_id' => Auth::id(),
            'package_created' => $package,
            'request data' => $request->validated(),
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $package->addMedia($image)->toMediaCollection('package_images');
            }
        }

        return redirect()->route('packages.show', $package)
            ->with('success', 'Package created successfully.');
    }

    /**
     * Display the specified package.
     */
    public function show(Package $package)
    {
        $package->load(['activities.timeSlots', 'owner']);
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
        ]);
    }

    /**
     * Show the form for editing the specified package.
     */
    public function edit(Package $package)
    {
        $package->load('activities.timeSlots');
        
        $activities = [];
        // if (Auth::user()->hasRole('agent')) {
        //     $activities = $this->activityService->getAgentActivities(Auth::id());
        // } else if (Auth::user()->hasRole('admin')) {
        //     $activities = $this->activityService->getAllActivities();
        // }
        
        $allActivities = Activity::all(['id', 'title', 'price']);

        return Inertia::render('packages/editPackage', [
            'package'    => $package,
            'images'     => $package->getMedia('package_images')
                                ->map(fn($media) => [
                                    'id'        => $media->id,
                                    'url'       => $media->getUrl(),
                                    'thumbnail' => $media->getUrl('thumb'),
                                ]),
            'allActivities' => $allActivities,
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
        // $this->authorize('update', $package);
        
        $package->is_featured = !$package->is_featured;
        $package->save();
        
        return back()->with('success', 'Package featured status updated.');
    }

    /**
     * Toggle the active status of a package.
     */
    public function toggleActive(Package $package)
    {
        // $this->authorize('update', $package);
        
        $package->is_active = !$package->is_active;
        $package->save();
        
        return back()->with('success', 'Package active status updated.');
    }
}
