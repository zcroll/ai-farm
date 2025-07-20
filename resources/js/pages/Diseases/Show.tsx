import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Leaf, Clock, AlertTriangle, Shield, Wrench, Thermometer, Calendar, BarChart3, BookOpen } from 'lucide-react';

interface Disease {
  id: number;
  name: string;
  plant_type: string;
  description: string;
  scientific_details: string;
  treatment_suggestions: string;
  prevention_methods: string;
  required_tools: string;
  environmental_factors: string;
  severity_level: string;
  average_treatment_time: number;
  seasonal_prevalence: any;
  statistics: any;
  source_url: string | null;
}

interface Props {
  disease: Disease;
}

const formatDiseaseName = (name: string) => name.replace(/_/g, ' ').replace('___', ' - ');
const formatPlantType = (type: string) => type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
const getSeverityColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case 'high': return 'bg-red-500 text-white';
    case 'moderate to high': return 'bg-orange-500 text-white';
    case 'moderate': return 'bg-yellow-500 text-black';
    case 'low': return 'bg-green-500 text-white';
    case 'none': return 'bg-emerald-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

export default function DiseaseShow({ disease }: Props) {
  // Parse statistics if needed
  let stats: any = {};
  try {
    stats = typeof disease.statistics === 'string' ? JSON.parse(disease.statistics) : disease.statistics || {};
  } catch {
    stats = {};
  }

  return (
    <AppLayout>
      <Head title={`${formatDiseaseName(disease.name)} - Disease Library`} />
      <div className="py-8 px-4 sm:px-8 lg:px-16 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-6 mb-8">
            <Link href="/disease-library">
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Library
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white flex items-center gap-2">
                <BookOpen className="h-8 w-8 text-blue-500" />
                {formatDiseaseName(disease.name)}
              </h1>
              <p className="text-gray-400 mt-2 text-lg">{formatPlantType(disease.plant_type)}</p>
            </div>
            <Badge className={`${getSeverityColor(disease.severity_level)} text-lg py-2 px-4`}>
              {disease.severity_level || 'Unknown'} Severity
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <Leaf className="h-5 w-5" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200 leading-relaxed">{disease.description}</p>
                </CardContent>
              </Card>

              {/* Scientific Details */}
              {disease.scientific_details && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-400">
                      <BarChart3 className="h-5 w-5" />
                      Scientific Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-200 leading-relaxed">{disease.scientific_details}</p>
                  </CardContent>
                </Card>
              )}

              {/* Treatment Suggestions */}
              {disease.treatment_suggestions && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-400">
                      <Wrench className="h-5 w-5" />
                      Treatment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-200 leading-relaxed whitespace-pre-line">
                      {disease.treatment_suggestions}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Prevention Methods */}
              {disease.prevention_methods && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-400">
                      <Shield className="h-5 w-5" />
                      Prevention
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-200 leading-relaxed whitespace-pre-line">
                      {disease.prevention_methods}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Environmental Factors */}
              {disease.environmental_factors && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-400">
                      <Thermometer className="h-5 w-5" />
                      Environmental Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-200 leading-relaxed">{disease.environmental_factors}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Info */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Quick Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Plant Type:</span>
                    <span className="text-sm font-medium text-gray-200">{formatPlantType(disease.plant_type)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Severity:</span>
                    <Badge className={getSeverityColor(disease.severity_level)}>
                      {disease.severity_level || 'Unknown'}
                    </Badge>
                  </div>
                  {disease.average_treatment_time && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Treatment Time:</span>
                      <span className="text-sm font-medium flex items-center text-gray-200">
                        <Clock className="h-4 w-4 mr-1" />
                        ~{disease.average_treatment_time} days
                      </span>
                    </div>
                  )}
                  {disease.required_tools && (
                    <div className="flex items-start justify-between">
                      <span className="text-sm text-gray-400">Tools Needed:</span>
                      <span className="text-sm font-medium text-right max-w-xs text-gray-200">
                        {disease.required_tools}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Statistics */}
              {stats && Object.keys(stats).length > 0 && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-400">
                      <BarChart3 className="h-5 w-5" />
                      Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {stats.infection_rate && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Infection Rate:</span>
                          <span className="text-sm font-medium text-gray-200">{stats.infection_rate}</span>
                        </div>
                      )}
                      {stats.yield_impact && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Yield Impact:</span>
                          <span className="text-sm font-medium text-gray-200">{stats.yield_impact}</span>
                        </div>
                      )}
                      {stats.treatment_success_rate && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Treatment Success:</span>
                          <span className="text-sm font-medium text-gray-200">{stats.treatment_success_rate}</span>
                        </div>
                      )}
                      {stats.common_regions && (
                        <div className="flex items-start justify-between">
                          <span className="text-sm text-gray-400">Common Regions:</span>
                          <span className="text-sm font-medium text-right max-w-xs text-gray-200">
                            {(Array.isArray(stats.common_regions) ? stats.common_regions.join(', ') : stats.common_regions)}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Source Link */}
              {disease.source_url && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Source</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={disease.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 underline"
                    >
                      View Source
                    </a>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}