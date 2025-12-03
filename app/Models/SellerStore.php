<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellerStore extends Model
{
    protected $fillable = [
        'seller_id',
        'name',
        'formatted_address',
        'address_line',
        'latitude',
        'longitude',
        'meta'
    ];

    protected $casts = [
        'meta' => 'array',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function distanceTo(float $latitude, float $longitude, bool $inKilometers = true): float
    {
        $earthRadiusKm = 6371;
        $latFrom = deg2rad($this->latitude);
        $lonFrom = deg2rad($this->longitude);
        $latTo = deg2rad($latitude);
        $lonTo = deg2rad($longitude);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $a = sin($latDelta / 2) ** 2 +
            cos($latFrom) * cos($latTo) * sin($lonDelta / 2) ** 2;

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        $distanceKm = $earthRadiusKm * $c;

        return $inKilometers ? $distanceKm : $distanceKm * 0.621371;
    }
}
