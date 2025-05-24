<?php

namespace App\Services;

use App\Models\Package;
use App\Models\PlatformSetting;
use App\Repositories\PackageRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class PackageService
{
    public function __construct(
        private PackageRepository $packageRepository
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
            $payload = $this->mapPackageData($data);
            $package = $this->packageRepository->create($payload);

            $this->handleActivities($package, $data);

            return $package->load(['activities', 'media']);
        });
    }

    public function updatePackage($id, array $data): Package
    {
        return DB::transaction(function () use ($id, $data) {
            $payload = $this->mapPackageData($data);
            $updated = $this->packageRepository->update($id, $payload);

            $this->handleActivities($updated, $data);

            return $updated->load(['activities', 'media']);
        });
    }

    public function deletePackage($id): bool
    {
        return $this->packageRepository->delete($id);
    }

    public function getFilteredPackages(array $filters)
    {
        return $this->packageRepository->filter($filters);
    }

    public function getUserPackages($user)
    {
        return $this->packageRepository->getByOwner($user->id);
    }

    public function calculateTotalPrice(Package $package): float
    {
        $subtotal = $package->base_price + $package->activities->sum('price');
        $settings = PlatformSetting::first();

        $agentPrice = $package->agent_price_type === 'fixed'
            ? $subtotal + $package->agent_addon_price
            : $subtotal * (1 + $package->agent_addon_price / 100);

        if ($settings) {
            return $settings->admin_addon_type === 'fixed'
                ? $agentPrice + $settings->admin_addon_amount
                : $agentPrice * (1 + $settings->admin_addon_amount / 100);
        }

        return $agentPrice;
    }

    private function mapPackageData(array $data): array
    {
        return [
            'title'                   => $data['title'],
            'description'             => $data['description'],
            'base_price'              => $data['base_price'],
            'agent_addon_price'       => $data['agent_addon_price'],
            'agent_price_type'        => $data['agent_price_type'],
            'check_in_time'           => $data['check_in_time'],
            'check_out_time'          => $data['check_out_time'],
            'booking_start_date'      => $data['booking_start_date'],
            'booking_end_date'        => $data['booking_end_date'],
            'is_active'               => $data['is_active'] ?? true,
            'is_featured'             => $data['is_featured'] ?? false,
            'is_refundable'           => $data['is_refundable'] ?? true,
            'terms_and_conditions'    => $data['terms_and_conditions'] ?? null,
            'cancellation_policy'     => $data['cancellation_policy'] ?? null,
            'destination'             => $data['destination'],
            'owner_id'                => $data['owner_id'] ?? Auth::id(),
            'visibility'              => $data['visibility'] ?? 'public',
        ];
    }

    private function handleActivities(Package $package, array $data): void
    {
        if (isset($data['activities'])) {
            // clear existing activities
            $package->activities()->delete();
            // re-create
            foreach ($data['activities'] as $activity) {
                $package->activities()->create($activity);
            }
        }
    }
}


// namespace App\Services;

// use App\Models\Package;
// use App\Models\PackageAddon;
// use App\Repositories\Contracts\PackageRepositoryInterface;
// use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Auth;

// class PackageService
// {

    
//     public function __construct(
//         private PackageRepositoryInterface $packageRepository
//     ) {}

//     public function getAllPackages()
//     {
//         return $this->packageRepository->all();
//     }

//     public function getPackage(int $id): ?Package
//     {
//         return $this->packageRepository->find($id);
//     }

//     public function createPackage(array $data): Package
//     {
//         return DB::transaction(function () use ($data) {
//             $packageData = [
//                 'title' => $data['title'],
//                 'description' => $data['description'],
//                 'base_price' => $data['base_price'],
//                 'location' => $data['location'],
//                 'owner_id' => $data['owner_id'] ?? Auth::id(),
//                 'visibility' => $data['visibility'] ?? 'public',
//             ];

//             $package = $this->packageRepository->create($packageData);

//             // Create activities if provided
//             if (!empty($data['activities'])) {
//                 foreach ($data['activities'] as $activityData) {
//                     $package->activities()->create($activityData);
//                 }
//             }

//             // Create addon if provided
//             if (!empty($data['addon'])) {
//                 $package->addon()->create($data['addon']);
//             }

//             return $package->load(['activities', 'addon']);
//         });
//     }

//     public function updatePackage(int $id, array $data): Package
//     {
//         return DB::transaction(function () use ($id, $data) {
//             $package = $this->packageRepository->update($id, $data);

//             // Update activities if provided
//             if (isset($data['activities'])) {
//                 $package->activities()->delete();
//                 foreach ($data['activities'] as $activityData) {
//                     $package->activities()->create($activityData);
//                 }
//             }

//             // Update addon if provided
//             if (isset($data['addon'])) {
//                 $package->addon()->delete();
//                 if (!empty($data['addon'])) {
//                     $package->addon()->create($data['addon']);
//                 }
//             }

//             return $package->load(['activities', 'addon']);
//         });
//     }

//     public function deletePackage(int $id): bool
//     {
//         return $this->packageRepository->delete($id);
//     }

//     public function filterPackages(array $filters)
//     {
//         return $this->packageRepository->filter($filters);
//     }

//     public function getPackagesByOwner(int $ownerId)
//     {
//         return $this->packageRepository->getByOwner($ownerId);
//     }

//     public function calculateTotalPrice(Package $package): float
//     {
//         $basePrice = $package->base_price;
        
//         // Get latest global admin addon
//         $globalAddon = PackageAddon::latest()->first();
        
//         if ($globalAddon) {
//             if ($globalAddon->type === 'fixed') {
//                 return $basePrice + $globalAddon->amount;
//             } else {
//                 return $basePrice + ($basePrice * $globalAddon->amount / 100);
//             }
//         }
        
//         return $basePrice;
//     }
// }