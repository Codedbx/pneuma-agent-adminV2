<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PackageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'base_price' => $this->base_price,
            'check_in_time' => $this->check_in_time,
            'check_out_time' => $this->check_out_time,
            // ... add other fields you want ...
            'booking_start_date' => $this->booking_start_date,
            'booking_end_date' => $this->booking_end_date,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'is_refundable' => $this->is_refundable,
            'terms_and_conditions' => $this->terms_and_conditions,
            'cancellation_policy' => $this->cancellation_policy,
            'location' => $this->location,
            'owner_id' => $this->owner_id,
            'visibility' => $this->visibility,
            'activities_count' => $this->activities->count(),
            'media' => $this->getMedia('package_images')->map(function ($media) {
                return [
                    'id' => $media->id,
                    'url' => $media->getUrl(),
                    'thumbnail_url' => $media->getUrl('thumb'),
                    'name' => $media->file_name,
                    'size' => $media->size,
                    'mime_type' => $media->mime_type,
                ];
            }),
            'activities' => ActivityResource::collection(
                $this->activities->map(fn($packageActivity) => $packageActivity->activity)
            ),
        ];
    }
}
