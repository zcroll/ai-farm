<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('diseases', function (Blueprint $table) {
            $table->text('scientific_details')->nullable()->after('description');
            $table->text('prevention_methods')->nullable()->after('treatment_suggestions');
            $table->text('required_tools')->nullable()->after('prevention_methods');
            $table->text('environmental_factors')->nullable()->after('required_tools');
            $table->string('severity_level', 50)->nullable()->after('environmental_factors');
            $table->float('average_treatment_time', 5, 2)->nullable()->after('severity_level');
            $table->string('plant_type', 100)->nullable()->after('average_treatment_time');
            $table->json('seasonal_prevalence')->nullable()->after('plant_type');
            $table->json('statistics')->nullable()->after('seasonal_prevalence');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('diseases', function (Blueprint $table) {
            $table->dropColumn([
                'scientific_details',
                'prevention_methods',
                'required_tools',
                'environmental_factors',
                'severity_level',
                'average_treatment_time',
                'plant_type',
                'seasonal_prevalence',
                'statistics'
            ]);
        });
    }
};
