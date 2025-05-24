<?php

namespace App\Repositories\Contracts;

use App\Models\Activity;

interface ActivityRepositoryInterface
{
    public function all();
    public function find(int $id): ?Activity;
    public function create(array $data): Activity;
    public function update(int $id, array $data): Activity;
    public function delete(int $id): bool;
    public function getByPackage(int $packageId);
}