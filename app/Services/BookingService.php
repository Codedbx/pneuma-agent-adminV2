<?php

namespace App\Services;

use App\Events\BookingCreated;
use App\Models\Booking;
use App\Models\Package;
use App\Models\PackageAddon;
use App\Repositories\Contracts\BookingRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class BookingService
{
    public function __construct(
        private BookingRepositoryInterface $bookingRepository
    ) {}

    public function createBooking(int $packageId, array $data): Booking
    {
        $package = Package::findOrFail($packageId);
        
        // Get latest global admin addon
        $globalAddon = PackageAddon::latest()->first();
        $adminAddonAmount = 0;
        
        if ($globalAddon) {
            $adminAddonAmount = $globalAddon->type === 'fixed' 
                ? $globalAddon->amount 
                : ($package->base_price * $globalAddon->amount / 100);
        }
        
        $totalPrice = $package->base_price + $adminAddonAmount;
        
        $booking = $this->bookingRepository->create([
            'user_id' => $data['user_id'] ?? Auth::id(),
            'package_id' => $packageId,
            'admin_addon_amount' => $adminAddonAmount,
            'agent_base_price' => $package->base_price,
            'total_price' => $totalPrice,
            'status' => 'pending',
        ]);
        
        // Fire event for email/invoice generation
        event(new BookingCreated($booking));
        
        return $booking;
    }

    public function confirmBooking(int $id): Booking
    {
        $booking = $this->bookingRepository->find($id);
        
        if (!$booking) {
            throw new \Exception('Booking not found');
        }
        
        return $this->bookingRepository->update($id, ['status' => 'confirmed']);
    }

    public function cancelBooking(int $id): Booking
    {
        $booking = $this->bookingRepository->find($id);
        
        if (!$booking) {
            throw new \Exception('Booking not found');
        }
        
        return $this->bookingRepository->update($id, ['status' => 'cancelled']);
    }

    public function getUserBookings(int $userId)
    {
        return $this->bookingRepository->getByUser($userId);
    }
}