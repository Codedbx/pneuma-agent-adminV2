<?php

namespace App\Repositories;

use App\Models\Package;
use App\Repositories\Contracts\PackageRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

class PackageRepository implements PackageRepositoryInterface
{
    public function all()
    {
        return Package::with(['activities.timeSlots', 'owner'])->get();
    }

    public function find(int $id): ?Package
    {
        $package = Package::with(['media','activities.timeSlots', 'owner'])
                        ->find($id);

        Log::info('PackageRepository@find', [
            'id'      => $id,
            'package' => $package,
        ]);

        return $package;
    }


    public function create(array $data): Package
    {
        return Package::create($data);
    }

    public function update(int $id, array $data): Package
    {
        $package = Package::findOrFail($id);
        $package->update($data);
        return $package->fresh();
    }

    public function delete(int $id): bool
    {
        return Package::destroy($id) > 0;
    }

    public function getByOwner(int $ownerId)
    {
        return Package::where('owner_id', $ownerId)
            ->with(['activities'])
            ->get();
    }

    public function filter(array $filters): LengthAwarePaginator
    {
        $query = Package::with(['media','activities.timeSlots', 'owner'])
                        ->visible(); 

        if (!empty($filters['destination'])) {
            $query->where('location', 'like', '%' . $filters['destination'] . '%');
        }

        if (!empty($filters['search'])) {
            $query->where('title', 'like', '%' . $filters['search'] . '%');
        }

        if (
            array_key_exists('price_min', $filters) && $filters['price_min'] !== '' 
         || array_key_exists('price_max', $filters) && $filters['price_max'] !== ''
        ) {
            $min = $filters['price_min'] !== '' ? $filters['price_min'] : 0;
            $max = $filters['price_max'] !== '' ? $filters['price_max'] : PHP_INT_MAX;
            $query->whereBetween('base_price', [$min, $max]);
        }

        if (!empty($filters['activities']) && is_array($filters['activities'])) {
            $query->whereHas('activities', function ($q) use ($filters) {
                $q->whereIn('id', $filters['activities']);
            });
        }

        if (!empty($filters['date_start']) && !empty($filters['date_end'])) {
            $query->where('booking_start_date', '<=', $filters['date_end'])
                  ->where('booking_end_date', '>=',   $filters['date_start']);
        }

        $sortBy  = $filters['sort']      ?? 'title';
        $sortDir = $filters['direction'] ?? 'asc';
        $query->orderBy($sortBy, $sortDir);

        $perPage = $filters['per_page'] ?? 5;
        return $query->paginate($perPage);
    }

}