<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Booking extends Model
{
    
    protected $fillable = [
        'user_id',
        'package_id',
        'admin_addon_amount',
        'agent_base_price',
        'total_price',
        'status',
    ];

    protected $casts = [
        'admin_addon_amount' => 'decimal:2',
        'agent_base_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'status' => 'string',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }
}
