<?php

namespace App\Services;

use App\Events\BookingCreated;
use App\Models\Booking;
use App\Models\Package;
use App\Models\PackageAddon;
use App\Repositories\Contracts\BookingRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BookingService
{
    public function __construct(
        private BookingRepositoryInterface $bookingRepository
    ) {}

    /**
     * Create a new booking, computing all pricing fields.
     */
    public function createBooking(array $data): Booking
    {
        return DB::transaction(function () use ($data) {
            $package = Package::with('activities')->findOrFail($data['package_id']);
            $pax    = $data['pax_count'];

            // Base + activities per person
            $basePrice          = $package->base_price;
            $activitiesTotal    = $package->activities->sum('price');
            
            // Agent addon per person
            $agentAddonPerPerson = $package->agent_price_type === 'fixed'
                ? $package->agent_addon_price
                : ($basePrice * $package->agent_addon_price / 100);

            // Global admin addon per person
            $globalAddon = PackageAddon::latest()->first();
            $adminAddonPerPerson = 0;
            if ($globalAddon) {
                $adminAddonPerPerson = $globalAddon->type === 'fixed'
                    ? $globalAddon->amount
                    : ($basePrice * $globalAddon->amount / 100);
            }

            $totalPerPerson = $basePrice
                + $activitiesTotal
                + $agentAddonPerPerson
                + $adminAddonPerPerson;

            $totalPriceAll = $totalPerPerson * $pax;

            $booking = $this->bookingRepository->create([
                'user_id'                  => $data['user_id'] ?? Auth::id(),
                'guest_first_name'         => $data['guest_first_name'],
                'guest_last_name'          => $data['guest_last_name'],
                'guest_email'              => $data['guest_email'],
                'guest_phone'              => $data['guest_phone'] ?? null,
                'guest_country'            => $data['guest_country'] ?? null,
                'guest_city'               => $data['guest_city'] ?? null,
                'guest_zip_code'           => $data['guest_zip_code'] ?? null,
                'guest_gender'             => $data['guest_gender'] ?? null,
                'package_id'               => $package->id,
                'pax_count'                => $pax,
                'base_price'               => $basePrice,
                'activities_total'         => $activitiesTotal,
                'computed_agent_addon'     => $agentAddonPerPerson,
                'computed_admin_addon'     => $adminAddonPerPerson,
                'total_price_per_person'   => $totalPerPerson,
                'total_price'              => $totalPriceAll,
                'status'                   => 'pending',
            ]);

            event(new BookingCreated($booking));

            return $booking;
        });
    }

    public function confirmBooking(int $id): Booking
    {
        $booking = $this->bookingRepository->find($id);
        if (! $booking) {
            throw new \Exception('Booking not found.');
        }
        return $this->bookingRepository->update($id, ['status' => 'confirmed']);
    }

    public function cancelBooking(int $id): Booking
    {
        $booking = $this->bookingRepository->find($id);
        if (! $booking) {
            throw new \Exception('Booking not found.');
        }
        return $this->bookingRepository->update($id, ['status' => 'cancelled']);
    }

    public function getUserBookings(int $userId)
    {
        return $this->bookingRepository->getByUser($userId);
    }
}


// namespace App\Services;

// use App\Events\BookingCreated;
// use App\Models\Booking;
// use App\Models\Package;
// use App\Models\PackageAddon;
// use App\Repositories\Contracts\BookingRepositoryInterface;
// use Illuminate\Support\Facades\Auth;

// class BookingService
// {
//     public function __construct(
//         private BookingRepositoryInterface $bookingRepository
//     ) {}

//     public function createBooking(int $packageId, array $data): Booking
//     {
//         $package = Package::findOrFail($packageId);
        
//         // Get latest global admin addon
//         $globalAddon = PackageAddon::latest()->first();
//         $adminAddonAmount = 0;
        
//         if ($globalAddon) {
//             $adminAddonAmount = $globalAddon->type === 'fixed' 
//                 ? $globalAddon->amount 
//                 : ($package->base_price * $globalAddon->amount / 100);
//         }
        
//         $totalPrice = $package->base_price + $adminAddonAmount;
        
//         $booking = $this->bookingRepository->create([
//             'user_id' => $data['user_id'] ?? Auth::id(),
//             'package_id' => $packageId,
//             'admin_addon_amount' => $adminAddonAmount,
//             'agent_base_price' => $package->base_price,
//             'total_price' => $totalPrice,
//             'status' => 'pending',
//         ]);
        
//         // Fire event for email/invoice generation
//         event(new BookingCreated($booking));
        
//         return $booking;
//     }

//     public function confirmBooking(int $id): Booking
//     {
//         $booking = $this->bookingRepository->find($id);
        
//         if (!$booking) {
//             throw new \Exception('Booking not found');
//         }
        
//         return $this->bookingRepository->update($id, ['status' => 'confirmed']);
//     }

//     public function cancelBooking(int $id): Booking
//     {
//         $booking = $this->bookingRepository->find($id);
        
//         if (!$booking) {
//             throw new \Exception('Booking not found');
//         }
        
//         return $this->bookingRepository->update($id, ['status' => 'cancelled']);
//     }

//     public function getUserBookings(int $userId)
//     {
//         return $this->bookingRepository->getByUser($userId);
//     }
// }