<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Package extends Model
{
    /** @use HasFactory<\Database\Factories\PakageFactory> */
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'title',
        'description',
        'base_price',
        'location',
        'owner_id',
        'visibility',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
        'visibility' => 'string',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }

    public function addon(): HasOne
    {
        return $this->hasOne(PackageAddon::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp']);
            
        $this->addMediaCollection('videos')
            ->acceptsMimeTypes(['video/mp4', 'video/avi', 'video/mov']);
    }

    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(300)
            ->height(200)
            ->sharpen(10);
    }

    public function getTotalPriceAttribute(): float
    {
        $basePrice = $this->base_price;
        
        if ($this->addon) {
            if ($this->addon->type === 'fixed') {
                return $basePrice + $this->addon->amount;
            } else {
                return $basePrice + ($basePrice * $this->addon->amount / 100);
            }
        }
        
        return $basePrice;
    }

    public function scopeVisible($query)
    {
        return $query->where('visibility', 'public');
    }

    public function scopeByLocation($query, string $location)
    {
        return $query->where('location', 'like', "%{$location}%");
    }

    public function scopeByPriceRange($query, float $min = null, float $max = null)
    {
        if ($min !== null) {
            $query->where('base_price', '>=', $min);
        }
        
        if ($max !== null) {
            $query->where('base_price', '<=', $max);
        }
        
        return $query;
    }

    public function scopeWithActivities($query, array $activityTitles, string $match = 'any')
    {
        if ($match === 'all') {
            foreach ($activityTitles as $title) {
                $query->whereHas('activities', function ($q) use ($title) {
                    $q->where('title', 'like', "%{$title}%");
                });
            }
        } else {
            $query->whereHas('activities', function ($q) use ($activityTitles) {
                $q->whereIn('title', $activityTitles);
            });
        }
        
        return $query;
    }
}