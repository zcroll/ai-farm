import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Leaf, AlertTriangle, CheckCircle, Filter, Activity, BarChart3, PieChart as PieChartIcon, Clock } from 'lucide-react';
import DiseaseStatsCard from './disease-stats-card';

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

interface Scan {
  id: number;
  image_path: string;
  predicted_disease: string;
  confidence: number;
  created_at: string;
  disease_id: number;
  user_id: number;
}

interface DiseaseDashboardProps {
  diseases: Disease[];
  userScans?: Scan[];
}

export const DiseaseDashboard: React.FC<DiseaseDashboardProps> = ({ diseases, userScans = [] }) => {
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [filter, setFilter] = useState('all');
  const [plantTypeFilter, setPlantTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'stats' | 'details'>('stats');
  
  // Extract unique plant types
  const plantTypes = Array.from(new Set(diseases.map(d => d.plant_type))).sort();
  
  // Filter diseases based on current filters
  const filteredDiseases = diseases.filter(disease => {
    // Filter by health status
    if (filter === 'healthy' && !disease.name.toLowerCase().includes('healthy')) return false;
    if (filter === 'diseased' && disease.name.toLowerCase().includes('healthy')) return false;
    
    // Filter by plant type
    if (plantTypeFilter !== 'all' && disease.plant_type !== plantTypeFilter) return false;
    
    return true;
  });
  
  // Prepare data for charts
  const prepareChartData = () => {
    // Count diseases by plant type
    const plantTypeCounts = diseases.reduce((acc, disease) => {
      const plantType = disease.plant_type || 'Unknown';
      acc[plantType] = (acc[plantType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const plantTypeData = Object.keys(plantTypeCounts).map(type => ({
      name: type,
      value: plantTypeCounts[type]
    }));
    
    // Count healthy vs diseased
    const healthStatus = diseases.reduce((acc, disease) => {
      const isHealthy = disease.name.toLowerCase().includes('healthy');
      acc[isHealthy ? 'Healthy' : 'Diseased'] = (acc[isHealthy ? 'Healthy' : 'Diseased'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const healthData = Object.keys(healthStatus).map(status => ({
      name: status,
      value: healthStatus[status]
    }));
    
    // Severity distribution
    const severityCounts = diseases.reduce((acc, disease) => {
      const severity = disease.severity_level || 'Unknown';
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const severityData = Object.keys(severityCounts).map(severity => ({
      name: severity,
      value: severityCounts[severity]
    }));
    
    // Treatment time by plant type
    const treatmentTimeByPlant = diseases.reduce((acc, disease) => {
      if (disease.average_treatment_time > 0) {
        const plantType = disease.plant_type || 'Unknown';
        if (!acc[plantType]) {
          acc[plantType] = {
            count: 0,
            total: 0
          };
        }
        acc[plantType].count += 1;
        acc[plantType].total += disease.average_treatment_time;
      }
      return acc;
    }, {} as Record<string, { count: number, total: number }>);
    
    const treatmentTimeData = Object.keys(treatmentTimeByPlant).map(plant => ({
      name: plant,
      value: treatmentTimeByPlant[plant].total / treatmentTimeByPlant[plant].count
    }));
    
    return {
      plantTypeData,
      healthData,
      severityData,
      treatmentTimeData
    };
  };
  
  const chartData = prepareChartData();
  
  // Colors for charts
  const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#FF6B6B', '#8884D8', '#82CA9D'];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Plant Disease Dashboard</h1>
          <p className="text-gray-400">Comprehensive insights into plant diseases and their treatments</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px] bg-gray-900 text-white border-gray-700">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-gray-700">
              <SelectItem value="all">All Conditions</SelectItem>
              <SelectItem value="healthy">Healthy Only</SelectItem>
              <SelectItem value="diseased">Diseased Only</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={plantTypeFilter} onValueChange={setPlantTypeFilter}>
            <SelectTrigger className="w-[180px] bg-gray-900 text-white border-gray-700">
              <SelectValue placeholder="Filter by plant" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-gray-700">
              <SelectItem value="all">All Plants</SelectItem>
              {plantTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex bg-gray-900 rounded-md border border-gray-700">
            <Button
              variant={viewMode === 'stats' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('stats')}
              className={viewMode === 'stats' ? 'bg-gray-700' : 'text-gray-300'}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistics
            </Button>
            <Button
              variant={viewMode === 'details' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('details')}
              className={viewMode === 'details' ? 'bg-gray-700' : 'text-gray-300'}
            >
              <Leaf className="h-4 w-4 mr-2" />
              Details
            </Button>
          </div>
        </div>
      </div>
      
      {viewMode === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-black text-white border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-blue-400" />
                Plant Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.plantTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.plantTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black text-white border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-400" />
                Health Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.healthData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#4ade80" /> {/* Green for healthy */}
                      <Cell fill="#f87171" /> {/* Red for diseased */}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black text-white border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                Severity Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.severityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.severityData.map((entry, index) => {
                        let color = '#9ca3af'; // Default gray
                        if (entry.name === 'High') color = '#ef4444'; // Red
                        if (entry.name === 'Moderate to High') color = '#f97316'; // Orange
                        if (entry.name === 'Moderate') color = '#eab308'; // Yellow
                        if (entry.name === 'Low') color = '#84cc16'; // Light green
                        if (entry.name === 'None') color = '#22c55e'; // Green
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black text-white border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-400" />
                Average Treatment Time by Plant Type
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData.treatmentTimeData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" label={{ value: 'Weeks', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} />
                    <Legend />
                    <Bar dataKey="value" name="Average Treatment Time (Weeks)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {viewMode === 'details' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDiseases.map(disease => (
              <motion.div
                key={disease.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 rounded-lg p-4 border border-gray-800 cursor-pointer hover:border-gray-700 transition-colors"
                onClick={() => setSelectedDisease(disease)}
              >
                <div className="flex items-center gap-2 mb-2">
                  {disease.name.toLowerCase().includes('healthy') ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  )}
                  <h3 className="font-medium text-white truncate">
                    {disease.name.replace(/_/g, ' ').replace('___', ' - ')}
                  </h3>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{disease.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">{disease.plant_type}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    disease.severity_level?.toLowerCase() === 'high' ? 'bg-red-900 text-red-200' :
                    disease.severity_level?.toLowerCase() === 'moderate' ? 'bg-yellow-900 text-yellow-200' :
                    disease.severity_level?.toLowerCase() === 'low' ? 'bg-green-900 text-green-200' :
                    disease.severity_level?.toLowerCase() === 'none' ? 'bg-blue-900 text-blue-200' :
                    'bg-gray-800 text-gray-300'
                  }`}>
                    {disease.severity_level || 'Unknown'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {selectedDisease && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <DiseaseStatsCard disease={selectedDisease} />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiseaseDashboard; 