<?php

namespace App\Services;

use App\Models\Activity;
use App\Repositories\Contracts\ActivityRepositoryInterface;

class ActivityService
{
    public function __construct(
        private ActivityRepositoryInterface $activityRepository
    ) {}

    public function getAllActivities()
    {
        return $this->activityRepository->all();
    }

    public function getActivity(int $id): ?Activity
    {
        return $this->activityRepository->find($id);
    }

    public function createActivity(array $data): Activity
    {
        return $this->activityRepository->create($data);
    }

    public function updateActivity(int $id, array $data): Activity
    {
        return $this->activityRepository->update($id, $data);
    }

    public function deleteActivity(int $id): bool
    {
        return $this->activityRepository->delete($id);
    }

    public function getActivitiesByPackage(int $packageId)
    {
        return $this->activityRepository->getByPackage($packageId);
    }
}