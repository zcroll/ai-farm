import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import DiseaseDashboard from '@/components/dashboard/disease-dashboard';

interface Disease {
  id: number;
  name: string;
  description: string;
  scientific_details: string;
  treatment_suggestions: string;
  prevention_methods: string;
  required_tools: string;
  environmental_factors: string;
  severity_level: string;
  average_treatment_time: number;
  plant_type: string;
  seasonal_prevalence: Record<string, string>;
  statistics: {
    infection_rate?: string;
    yield_impact?: string;
    treatment_success_rate?: string;
    common_regions?: string[];
    productivity?: string;
    lifespan?: string;
    pollination_requirements?: string;
    common_varieties?: string[];
    establishment_period?: string;
    growth_rate?: string;
    pollination?: string;
  };
  source_url: string | null;
}

interface DiseaseLibraryProps {
  diseases: Disease[];
  plantTypes: string[];
}

const DiseaseLibrary: React.FC<DiseaseLibraryProps> = ({ diseases, plantTypes }) => {
  return (
    <AppLayout>
      <Head title="Disease Library" />
      
      <div className="py-6 px-4 sm:px-6 lg:px-8 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">Disease Library</h1>
          <DiseaseDashboard diseases={diseases} />
        </div>
      </div>
    </AppLayout>
  );
};

export default DiseaseLibrary; 