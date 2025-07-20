import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import PlantScanner from '@/components/plant-scanner';

const Create: React.FC = () => {
  return (
    <AppLayout>
      <Head title="New Scan" />
      
      <div className="py-6 px-4 sm:px-6 lg:px-8 bg-black min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">New Plant Scan</h1>
            <p className="text-gray-400">Upload an image of your plant to detect diseases</p>
          </div>
          
          <PlantScanner />
        </div>
      </div>
    </AppLayout>
  );
};

export default Create;