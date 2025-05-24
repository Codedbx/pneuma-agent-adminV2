<?php

namespace App\Services;

use App\Models\Package;
use App\Models\PackageAddon;
use App\Repositories\Contracts\PackageRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class PackageService
{
    public function __construct(
        private PackageRepositoryInterface $packageRepository
    ) {}

    public function getAllPackages()
    {
        return $this->packageRepository->all();
    }

    public function getPackage(int $id): ?Package
    {
        return $this->packageRepository->find($id);
    }

    public function createPackage(array $data): Package
    {
        return DB::transaction(function () use ($data) {
            $packageData = [
                'title' => $data['title'],
                'description' => $data['description'],
                'base_price' => $data['base_price'],
                'location' => $data['location'],
                'owner_id' => $data['owner_id'] ?? Auth::id(),
                'visibility' => $data['visibility'] ?? 'public',
            ];

            $package = $this->packageRepository->create($packageData);

            // Create activities if provided
            if (!empty($data['activities'])) {
                foreach ($data['activities'] as $activityData) {
                    $package->activities()->create($activityData);
                }
            }

            // Create addon if provided
            if (!empty($data['addon'])) {
                $package->addon()->create($data['addon']);
            }

            return $package->load(['activities', 'addon']);
        });
    }

    public function updatePackage(int $id, array $data): Package
    {
        return DB::transaction(function () use ($id, $data) {
            $package = $this->packageRepository->update($id, $data);

            // Update activities if provided
            if (isset($data['activities'])) {
                $package->activities()->delete();
                foreach ($data['activities'] as $activityData) {
                    $package->activities()->create($activityData);
                }
            }

            // Update addon if provided
            if (isset($data['addon'])) {
                $package->addon()->delete();
                if (!empty($data['addon'])) {
                    $package->addon()->create($data['addon']);
                }
            }

            return $package->load(['activities', 'addon']);
        });
    }

    public function deletePackage(int $id): bool
    {
        return $this->packageRepository->delete($id);
    }

    public function filterPackages(array $filters)
    {
        return $this->packageRepository->filter($filters);
    }

    public function getPackagesByOwner(int $ownerId)
    {
        return $this->packageRepository->getByOwner($ownerId);
    }

    public function calculateTotalPrice(Package $package): float
    {
        $basePrice = $package->base_price;
        
        // Get latest global admin addon
        $globalAddon = PackageAddon::latest()->first();
        
        if ($globalAddon) {
            if ($globalAddon->type === 'fixed') {
                return $basePrice + $globalAddon->amount;
            } else {
                return $basePrice + ($basePrice * $globalAddon->amount / 100);
            }
        }
        
        return $basePrice;
    }
}