<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    /** @use HasFactory<\Database\Factories\ReportFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'category',
        'status',
        'latitude',
        'longitude',
        'city_id',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
        ];
    }

    public static function categories(): array
    {
        return ['trash', 'road', 'light', 'other'];
    }

    public static function statuses(): array
    {
        return ['pending', 'verified', 'rejected', 'resolved'];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function images()
    {
        return $this->hasMany(ReportImage::class);
    }

    public function verifications()
    {
        return $this->hasMany(Verification::class);
    }

    public function statusHistories()
    {
        return $this->hasMany(ReportStatusHistory::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }
}
