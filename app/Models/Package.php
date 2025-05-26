<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Package extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'title',
        'description',
        'base_price',
        'agent_addon_price',
        'agent_price_type',
        'check_in_time',
        'check_out_time',
        'booking_start_date',
        'booking_end_date',
        'is_active',
        'is_featured',
        'is_refundable',
        'terms_and_conditions',
        'cancellation_policy',
        'location',
        'owner_id',
        'visibility',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
        'agent_addon_price' => 'decimal:2',
        'check_in_time' => 'datetime',
        'check_out_time' => 'datetime',
        'booking_start_date' => 'datetime',
        'booking_end_date' => 'datetime',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'is_refundable' => 'boolean',
    ];

    // Relationships
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(PackageActivity::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    // Media Handling
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('package_images')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp'])
            ->withResponsiveImages();
            
        $this->addMediaCollection('package_videos')
            ->acceptsMimeTypes(['video/mp4', 'video/avi', 'video/mov'])
            ->singleFile();
    }

    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(300)
            ->height(200)
            ->sharpen(10);
    }

    // Computed Attributes
    public function getAgentTotalAttribute(): float
    {
        return $this->agent_price_type === 'fixed' 
            ? $this->base_price + $this->agent_addon_price
            : $this->base_price * (1 + $this->agent_addon_price / 100);
    }

    // Scopes
    public function scopeVisible($query)
    {
        return $query->where('visibility', 'public')->where('is_active', true);
    }

    public function scopeSearchTitle($query, string $term)
    {
        return $query->where('title', 'LIKE', '%' . $term . '%');
    }

    public function scopeByDestination($query, string $destination)
    {
        return $query->where('location', 'like', "%{$destination}%");
    }

    public function scopeByPriceRange($query, float $min = null, float $max = null)
    {
        return $query->whereBetween('base_price', [$min ?? 0, $max ?? PHP_INT_MAX]);
    }

    public function scopeActiveBetween($query, $start, $end)
    {
        return $query->where('booking_start_date', '<=', $end)
            ->where('booking_end_date', '>=', $start);
    }

    public function scopeFilterByActivityTitles($query, array $titles, string $match = 'any')
    {
        if ($match === 'all') {
            foreach ($titles as $t) {
                $query->whereHas('activities', fn($q) => 
                    $q->where('title', 'LIKE', "%{$t}%")
                );
            }
        } elseif ($match === 'none') {
            $query->whereDoesntHave('activities', fn($q) => 
                $q->whereIn('title', $titles) 
            );
        } else {
            $query->whereHas('activities', fn($q) => 
                $q->whereIn('title', $titles)
            );
        }

        return $query;
    }

}

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\Relations\BelongsTo;
// use Illuminate\Database\Eloquent\Relations\HasMany;
// use Illuminate\Database\Eloquent\Relations\HasOne;
// use Spatie\MediaLibrary\HasMedia;
// use Spatie\MediaLibrary\InteractsWithMedia;
// use Spatie\MediaLibrary\MediaCollections\Models\Media;

// class Package extends Model
// {
//     /** @use HasFactory<\Database\Factories\PakageFactory> */
//     use HasFactory, InteractsWithMedia;

//     protected $fillable = [
//         'title',
//         'description',
//         'base_price',
//         'location',
//         'owner_id',
//         'visibility',
//     ];

//     protected $casts = [
//         'base_price' => 'decimal:2',
//         'visibility' => 'string',
//     ];

//     public function owner(): BelongsTo
//     {
//         return $this->belongsTo(User::class, 'owner_id');
//     }

//     public function activities(): HasMany
//     {
//         return $this->hasMany(Activity::class);
//     }

//     public function addon(): HasOne
//     {
//         return $this->hasOne(PackageAddon::class);
//     }

//     public function bookings(): HasMany
//     {
//         return $this->hasMany(Booking::class);
//     }

//     public function registerMediaCollections(): void
//     {
//         $this->addMediaCollection('images')
//             ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp']);
            
//         $this->addMediaCollection('videos')
//             ->acceptsMimeTypes(['video/mp4', 'video/avi', 'video/mov']);
//     }

//     public function registerMediaConversions(Media $media = null): void
//     {
//         $this->addMediaConversion('thumb')
//             ->width(300)
//             ->height(200)
//             ->sharpen(10);
//     }

//     public function getTotalPriceAttribute(): float
//     {
//         $basePrice = $this->base_price;
        
//         if ($this->addon) {
//             if ($this->addon->type === 'fixed') {
//                 return $basePrice + $this->addon->amount;
//             } else {
//                 return $basePrice + ($basePrice * $this->addon->amount / 100);
//             }
//         }
        
//         return $basePrice;
//     }

//     public function scopeVisible($query)
//     {
//         return $query->where('visibility', 'public');
//     }

//     public function scopeByLocation($query, string $location)
//     {
//         return $query->where('location', 'like', "%{$location}%");
//     }

//     public function scopeByPriceRange($query, float $min = null, float $max = null)
//     {
//         if ($min !== null) {
//             $query->where('base_price', '>=', $min);
//         }
        
//         if ($max !== null) {
//             $query->where('base_price', '<=', $max);
//         }
        
//         return $query;
//     }

//     public function scopeWithActivities($query, array $activityTitles, string $match = 'any')
//     {
//         if ($match === 'all') {
//             foreach ($activityTitles as $title) {
//                 $query->whereHas('activities', function ($q) use ($title) {
//                     $q->where('title', 'like', "%{$title}%");
//                 });
//             }
//         } else {
//             $query->whereHas('activities', function ($q) use ($activityTitles) {
//                 $q->whereIn('title', $activityTitles);
//             });
//         }
        
//         return $query;
//     }
// }