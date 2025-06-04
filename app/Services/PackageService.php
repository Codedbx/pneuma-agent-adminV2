<?php

namespace App\Services;

use App\Models\Package;
use App\Models\PlatformSetting;
use App\Repositories\PackageRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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
            // $payload = $this->mapPackageData($data);
            $updated = $this->packageRepository->update($id, $data);

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
            'title'                   => $data['title'] ?? null ,
            'description'             => $data['description'] ?? null,
            'base_price'              => $data['base_price'] ?? 0.0,
            'agent_addon_price'       => $data['agent_addon_price'] ?? 0.0,
            'agent_price_type'        => $data['agent_price_type'],
            'booking_start_date'      => $data['booking_start_date'],
            'booking_end_date'        => $data['booking_end_date'],
            'is_active'               => $data['is_active'] ?? true,
            'is_featured'             => $data['is_featured'] ?? false,
            'is_refundable'           => $data['is_refundable'] ?? true,
            'terms_and_conditions'    => $data['terms_and_conditions'] ?? null,
            'cancellation_policy'     => $data['cancellation_policy'] ?? null,
            'location'             => $data['location'] ?? null,
            'owner_id'                => $data['owner_id'] ?? Auth::id(),
            'visibility'              => $data['visibility'] ?? 'public',
            'flight_from'            => $data['flight_from'] ?? null,   
            'flight_to'              => $data['flight_to'] ?? null,
            'airline_name'           => $data['airline_name'] ?? null,
            'booking_class'          => $data['booking_class'] ?? null,
            'airline_name'           => $data['airline_name'] ?? null,
            'booking_class'          => $data['booking_class'] ?? null,
            'hotel_name'            => $data['hotel_name'] ?? null,
            'hotel_star_rating' => $data['hotel_star_rating'] ?? null,
            'hotel_checkin'        => $data['hotel_checkin'] ?? null,
            'hotel_checkout'       => $data['hotel_checkout'] ?? null,
        ];
    }
          
    

    private function handleActivities(Package $package, array $data): void
    {
        if (isset($data['activities']) && is_array($data['activities'])) {
            Log::info('Syncing activities for package', [
                'request_data' => $data,
                'activities' => $data['activities'],
            ]);
            $package->activities()->sync($data['activities']);
        }
    }

}
