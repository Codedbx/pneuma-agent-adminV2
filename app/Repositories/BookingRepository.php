<?php

namespace App\Repositories;

use App\Models\Booking;
use App\Repositories\Contracts\BookingRepositoryInterface;

class BookingRepository implements BookingRepositoryInterface
{
    public function all()
    {
        return Booking::with(['user', 'package', 'payment', 'invoice'])->get();
    }

    public function find(int $id): ?Booking
    {
        return Booking::with(['user', 'package', 'payment', 'invoice'])->find($id);
    }

    public function create(array $data): Booking
    {
        return Booking::create($data);
    }

    public function update(int $id, array $data): Booking
    {
        $booking = Booking::findOrFail($id);
        $booking->update($data);
        return $booking->fresh();
    }

    public function delete(int $id): bool
    {
        return Booking::destroy($id) > 0;
    }

    public function getByUser(int $userId)
    {
        return Booking::where('user_id', $userId)
            ->with(['package', 'payment', 'invoice'])
            ->orderBy('created_at', 'desc')
            ->get();
    }
}