<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Disease extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'description',
        'scientific_details',
        'treatment_suggestions',
        'prevention_methods',
        'required_tools',
        'environmental_factors',
        'severity_level',
        'average_treatment_time',
        'plant_type',
        'seasonal_prevalence',
        'statistics',
        'source_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'id' => 'integer',
            'average_treatment_time' => 'float',
            'seasonal_prevalence' => 'array',
            'statistics' => 'array',
        ];
    }

    /**
     * Get the scans for this disease.
     */
    public function scans(): HasMany
    {
        return $this->hasMany(Scan::class);
    }
    
    /**
     * Get the plant type from the disease name.
     */
    public function getPlantAttribute(): string
    {
        $parts = explode('___', $this->name);
        return str_replace('_', ' ', $parts[0]);
    }
    
    /**
     * Get the condition from the disease name.
     */
    public function getConditionAttribute(): string
    {
        $parts = explode('___', $this->name);
        return isset($parts[1]) ? str_replace('_', ' ', $parts[1]) : '';
    }
    
    /**
     * Check if the disease is a healthy condition.
     */
    public function getIsHealthyAttribute(): bool
    {
        return str_contains(strtolower($this->name), 'healthy');
    }
}
