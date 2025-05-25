<?php

namespace App\Repositories;

use App\Models\Package;
use App\Repositories\Contracts\PackageRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class PackageRepository implements PackageRepositoryInterface
{
    public function all()
    {
        return Package::with(['activities.activity.timeSlots', 'owner'])->get();
    }

    public function find(int $id): ?Package
    {
        return Package::with(['activities.activity.timeSlots', 'owner'])->find($id);
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
        $query = Package::with(['activities.activity.timeSlots', 'owner'])
            ->visible();

        // Location filter
        if (!empty($filters['location'])) {
            $query->byDestination($filters['location']);
        }

        // Price range filter
        if (!empty($filters['min_price']) || !empty($filters['max_price'])) {
            $query->byPriceRange(
                $filters['min_price'] ?? null,
                $filters['max_price'] ?? null
            );
        }

        // Activities filter
        if (!empty($filters['activities'])) {
            $match = $filters['activity_match'] ?? 'any';
            $query->withActivities($filters['activities'], $match);
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDir = $filters['sort_dir'] ?? 'desc';
        $query->orderBy($sortBy, $sortDir);

        return $query->paginate($filters['per_page'] ?? 15);
    }
}