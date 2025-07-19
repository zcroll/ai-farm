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
        'symptoms',
        'causes',
        'detailed_images',
        'scientific_details',
        'treatment_suggestions',
        'treatment_steps',
        'chemical_treatments',
        'organic_treatments',
        'prevention_methods',
        'monitoring_guidelines',
        'required_tools',
        'environmental_factors',
        'severity_level',
        'average_treatment_time',
        'plant_type',
        'seasonal_prevalence',
        'statistics',
        'source_url',
        'views_count',
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
            'detailed_images' => 'array',
            'views_count' => 'integer',
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
     * Get the posts related to this disease.
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    /**
     * Increment the view count.
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
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
