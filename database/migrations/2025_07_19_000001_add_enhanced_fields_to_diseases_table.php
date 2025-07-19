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
            $table->text('symptoms')->nullable()->after('description');
            $table->text('causes')->nullable()->after('symptoms');
            $table->json('detailed_images')->nullable()->after('causes');
            $table->text('treatment_steps')->nullable()->after('treatment_suggestions');
            $table->text('chemical_treatments')->nullable()->after('treatment_steps');
            $table->text('organic_treatments')->nullable()->after('chemical_treatments');
            $table->text('monitoring_guidelines')->nullable()->after('organic_treatments');
            $table->integer('views_count')->default(0)->after('monitoring_guidelines');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('diseases', function (Blueprint $table) {
            $table->dropColumn([
                'symptoms',
                'causes',
                'detailed_images',
                'treatment_steps',
                'chemical_treatments',
                'organic_treatments',
                'monitoring_guidelines',
                'views_count'
            ]);
        });
    }
};