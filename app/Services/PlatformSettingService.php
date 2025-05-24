<?php

namespace App\Services;

use App\Models\PlatformSetting;
use App\Repositories\PlatformSettingRepository;
// use App\Services\Interfaces\PlatformSettingServiceInterface;

class PlatformSettingService 
{
    /**
     * @var PlatformSettingRepository
     */
    protected $platformSettingRepository;

    /**
     * PlatformSettingService constructor.
     *
     * @param PlatformSettingRepositoryInterface $platformSettingRepository
     */
    public function __construct(PlatformSettingRepository $platformSettingRepository)
    {
        $this->platformSettingRepository = $platformSettingRepository;
    }

    /**
     * Get the platform settings.
     *
     * @return PlatformSetting
     */
    public function getSettings(): PlatformSetting
    {
        return $this->platformSettingRepository->getSettings();
    }

    /**
     * Update the platform settings.
     *
     * @param array $data
     * @return PlatformSetting
     */
    public function updateSettings(array $data): PlatformSetting
    {
        return $this->platformSettingRepository->updateSettings($data);
    }

    /**
     * Calculate the admin addon amount based on the price.
     *
     * @param float $price
     * @return float
     */
    public function calculateAdminAddonAmount(float $price): float
    {
        $settings = $this->getSettings();

        if ($settings->admin_addon_type === 'fixed') {
            return $settings->admin_addon_amount;
        } else {
            return $price * ($settings->admin_addon_amount / 100);
        }
    }
}