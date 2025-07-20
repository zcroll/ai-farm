import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Leaf } from 'lucide-react';
import PlantScanner from '@/components/plant-scanner';

export default function Scan() {
  return (
    <AppLayout>
      <Head title="Plant Health Scanner" />
      
      <div className="py-6 px-4 sm:px-6 lg:px-8 bg-black min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header with back navigation */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard">
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Leaf className="h-6 w-6 text-green-500" />
                Plant Health Scanner
              </h1>
              <p className="text-gray-400 mt-1">
                Upload or take a photo of your plant to detect diseases and get treatment recommendations
              </p>
            </div>
          </div>

          {/* Scanner Component */}
          <div className="space-y-6">
            <PlantScanner />
            
            {/* Help Section */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">How it works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-medium text-white mb-2">Capture Image</h3>
                  <p className="text-sm text-gray-400">
                    Upload a clear photo of your plant or use your camera to take a new picture
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-medium text-white mb-2">AI Analysis</h3>
                  <p className="text-sm text-gray-400">
                    Our AI model analyzes the image to detect diseases and health issues
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-medium text-white mb-2">Get Results</h3>
                  <p className="text-sm text-gray-400">
                    Receive detailed diagnosis with treatment suggestions and prevention methods
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/history">
                <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                  View Scan History
                </Button>
              </Link>
              <Link href="/disease-library">
                <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                  Disease Library
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                  Community Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}