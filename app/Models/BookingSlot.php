<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingSlot extends Model
{
     use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'booking_id',
        'activity_time_slot_id',
    ];

    /**
     * Get the booking that owns the booking slot.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the activity time slot that owns the booking slot.
     */
    public function activityTimeSlot(): BelongsTo
    {
        return $this->belongsTo(ActivityTimeSlot::class);
    }
}
