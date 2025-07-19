import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle, Search, Filter, Calendar, BarChart3 } from 'lucide-react';

interface DiagnosedDisease {
  id: number;
  name: string;
  description: string;
  treatment_suggestions: string;
  severity_level: string;
  average_treatment_time: number;
  plant_type: string;
  detection_count: number;
  last_detected: string;
  confidence_avg: number;
  scans: Array<{
    id: number;
    image_path: string;
    confidence: number;
    created_at: string;
  }>;
}

interface DiagnosedDiseasesProps {
  diagnosedDiseases: DiagnosedDisease[];
  stats: {
    total_detections: number;
    unique_diseases: number;
    healthy_detections: number;
    diseased_detections: number;
  };
}

const DiagnosedDiseases: React.FC<DiagnosedDiseasesProps> = ({ diagnosedDiseases, stats }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [plantTypeFilter, setPlantTypeFilter] = useState('all');

  // Filter diseases based on search and filters
  const filteredDiseases = diagnosedDiseases.filter(disease => {
    const matchesSearch = disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disease.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || disease.severity_level === severityFilter;
    const matchesPlantType = plantTypeFilter === 'all' || disease.plant_type === plantTypeFilter;
    
    return matchesSearch && matchesSeverity && matchesPlantType;
  });

  const formatDiseaseName = (name: string) => {
    return name.replace(/_/g, ' ').replace('___', ' - ');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  const getHealthStatus = (disease: DiagnosedDisease) => {
    return disease.name.toLowerCase().includes('healthy') ? 'healthy' : 'diseased';
  };

  const getHealthIcon = (disease: DiagnosedDisease) => {
    return getHealthStatus(disease) === 'healthy' ? CheckCircle : AlertTriangle;
  };

  const getHealthColor = (disease: DiagnosedDisease) => {
    return getHealthStatus(disease) === 'healthy' ? 'text-green-500' : 'text-amber-500';
  };

  return (
    <AppLayout>
      <Head title="Diagnosed Diseases" />
      
      <div className="py-6 px-4 sm:px-6 lg:px-8 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Diagnosed Diseases</h1>
              <p className="text-gray-400">Diseases detected through your plant scans</p>
            </div>
            
            <div className="flex gap-2">
              <Link href="/predictions/create">
                <Button className="bg-green-600 hover:bg-green-700">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  New Scan
                </Button>
              </Link>
              <Link href="/disease-library">
                <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Disease Library
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Total Detections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.total_detections}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Unique Diseases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.unique_diseases}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Healthy Detections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{stats.healthy_detections}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Diseased Detections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">{stats.diseased_detections}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search diagnosed diseases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </div>
            
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={plantTypeFilter} onValueChange={setPlantTypeFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Filter by plant type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Plants</SelectItem>
                {Array.from(new Set(diagnosedDiseases.map(d => d.plant_type))).map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Diseases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDiseases.length > 0 ? (
              filteredDiseases.map((disease) => {
                const HealthIcon = getHealthIcon(disease);
                const healthColor = getHealthColor(disease);
                
                return (
                  <Card key={disease.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <Badge variant={getSeverityColor(disease.severity_level)} className="text-xs">
                          {disease.severity_level}
                        </Badge>
                        <HealthIcon className={`h-5 w-5 ${healthColor}`} />
                      </div>
                      <CardTitle className="text-lg text-white">
                        {formatDiseaseName(disease.name)}
                      </CardTitle>
                      <p className="text-sm text-gray-400">
                        {disease.plant_type}
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                        {disease.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Detections:</span>
                          <span className="text-white font-medium">{disease.detection_count}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Avg Confidence:</span>
                          <span className="text-white font-medium">{Math.round(disease.confidence_avg * 100)}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Treatment Time:</span>
                          <span className="text-white font-medium">{disease.average_treatment_time} days</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                          onClick={() => window.open(`/diseases/${disease.id}`, '_blank')}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-gray-700 text-white hover:bg-gray-800"
                          onClick={() => window.open(`/history?disease=${disease.id}`, '_blank')}
                        >
                          View Scans
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full">
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="text-center py-12">
                    <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No diagnosed diseases found</h3>
                    <p className="text-gray-400 mb-4">
                      {searchTerm || severityFilter !== 'all' || plantTypeFilter !== 'all' 
                        ? 'Try adjusting your filters or search terms.'
                        : 'Start scanning your plants to detect diseases and see them here.'
                      }
                    </p>
                    <Link href="/predictions/create">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Start Scanning
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DiagnosedDiseases;