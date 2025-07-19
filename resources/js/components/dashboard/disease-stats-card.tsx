import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Leaf, Thermometer, Clock, Map, Droplet } from 'lucide-react';

interface DiseaseStatsCardProps {
  disease: {
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
  };
}

export const DiseaseStatsCard: React.FC<DiseaseStatsCardProps> = ({ disease }) => {
  const isHealthy = disease.name.toLowerCase().includes('healthy');
  const formattedDiseaseName = disease.name.replace(/_/g, ' ').replace('___', ' - ');
  
  // Extract plant and condition from name
  const parts = disease.name.split('___');
  const plant = parts[0].replace(/_/g, ' ');
  const condition = parts.length > 1 ? parts[1].replace(/_/g, ' ') : '';
  
  // Format seasonal prevalence data for visualization
  const seasonalData = disease.seasonal_prevalence || {};
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
  
  // Helper function to get severity color
  const getSeverityColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'moderate to high': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      case 'none': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Helper function to get prevalence value as percentage
  const getPrevalenceValue = (value: string) => {
    switch (value) {
      case 'Very High': return 100;
      case 'High': return 75;
      case 'Moderate': return 50;
      case 'Low': return 25;
      case 'Very Low': return 10;
      case 'None': return 0;
      default: return 0;
    }
  };
  
  // Helper function to get prevalence color class
  const getPrevalenceColorClass = (value: string) => {
    if (value === 'High' || value === 'Very High') return 'bg-red-500';
    if (value === 'Moderate') return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  return (
    <Card className="w-full overflow-hidden bg-black text-white border-gray-800">
      <CardHeader className={`${isHealthy ? 'border-b border-green-500/30' : 'border-b border-amber-500/30'}`}>
        <div className="flex items-center gap-2">
          {isHealthy ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          )}
          <CardTitle className="text-xl text-white">
            {formattedDiseaseName}
          </CardTitle>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant={isHealthy ? "success" : "default"} className="text-xs">
            {plant}
          </Badge>
          {!isHealthy && (
            <Badge variant="destructive" className="text-xs">
              {condition}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            Severity: {disease.severity_level || 'Unknown'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 grid gap-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
              <Leaf className="h-4 w-4 text-green-400" />
              Scientific Details
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              {disease.scientific_details || 'No scientific details available.'}
            </p>
            
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
              <Thermometer className="h-4 w-4 text-blue-400" />
              Environmental Factors
            </h3>
            <p className="text-sm text-gray-300">
              {disease.environmental_factors || 'No environmental factors available.'}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Seasonal Prevalence</h3>
            <div className="space-y-3">
              {seasons.map(season => {
                const prevalenceValue = seasonalData[season] || '';
                const colorClass = getPrevalenceColorClass(prevalenceValue);
                
                return (
                  <div key={season} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">{season}</span>
                      <span className="text-sm text-gray-300">
                        {prevalenceValue || 'N/A'}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colorClass} rounded-full`}
                        style={{ width: `${getPrevalenceValue(prevalenceValue)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            {disease.average_treatment_time > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                  <Clock className="h-4 w-4 text-purple-400" />
                  Treatment Time
                </h3>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden flex-1">
                    <div 
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${disease.average_treatment_time * 20}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-300 whitespace-nowrap">
                    {disease.average_treatment_time} weeks
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Treatment Approach</h3>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-300">
                {disease.treatment_suggestions || 'No treatment suggestions available.'}
              </p>
            </div>
            
            <h3 className="text-lg font-semibold mb-3 mt-4 text-white">Prevention Methods</h3>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-300">
                {disease.prevention_methods || 'No prevention methods available.'}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Required Tools</h3>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 mb-4">
              <p className="text-sm text-gray-300">
                {disease.required_tools || 'No specific tools required.'}
              </p>
            </div>
            
            {disease.statistics && Object.keys(disease.statistics).length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-3 text-white">Statistics</h3>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                  <ul className="space-y-2 text-sm text-gray-300">
                    {disease.statistics.infection_rate && (
                      <li className="flex justify-between">
                        <span>Infection Rate:</span>
                        <span className="font-medium">{disease.statistics.infection_rate}</span>
                      </li>
                    )}
                    {disease.statistics.yield_impact && (
                      <li className="flex justify-between">
                        <span>Yield Impact:</span>
                        <span className="font-medium">{disease.statistics.yield_impact}</span>
                      </li>
                    )}
                    {disease.statistics.treatment_success_rate && (
                      <li className="flex justify-between">
                        <span>Treatment Success:</span>
                        <span className="font-medium">{disease.statistics.treatment_success_rate}</span>
                      </li>
                    )}
                    {disease.statistics.productivity && (
                      <li className="flex justify-between">
                        <span>Productivity:</span>
                        <span className="font-medium">{disease.statistics.productivity}</span>
                      </li>
                    )}
                    {disease.statistics.lifespan && (
                      <li className="flex justify-between">
                        <span>Lifespan:</span>
                        <span className="font-medium">{disease.statistics.lifespan}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
        
        {disease.statistics?.common_regions && disease.statistics.common_regions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
              <Map className="h-4 w-4 text-indigo-400" />
              Common Regions
            </h3>
            <div className="flex flex-wrap gap-2">
              {disease.statistics.common_regions.map((region, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {region}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {disease.statistics?.common_varieties && disease.statistics.common_varieties.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
              <Droplet className="h-4 w-4 text-cyan-400" />
              Common Varieties
            </h3>
            <div className="flex flex-wrap gap-2">
              {disease.statistics.common_varieties.map((variety, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-gray-800 text-gray-200">
                  {variety}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiseaseStatsCard; 