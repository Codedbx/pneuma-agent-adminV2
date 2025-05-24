<?php

namespace App\Repositories;

use App\Models\Activity;
use App\Repositories\Contracts\ActivityRepositoryInterface;

class ActivityRepository implements ActivityRepositoryInterface
{
    public function all()
    {
        return Activity::with('package')->get();
    }

    public function find(int $id): ?Activity
    {
        return Activity::with('package')->find($id);
    }

    public function create(array $data): Activity
    {
        return Activity::create($data);
    }

    public function update(int $id, array $data): Activity
    {
        $activity = Activity::findOrFail($id);
        $activity->update($data);
        return $activity->fresh();
    }

    public function delete(int $id): bool
    {
        return Activity::destroy($id) > 0;
    }

    public function getByPackage(int $packageId)
    {
        return Activity::where('package_id', $packageId)->get();
    }
}