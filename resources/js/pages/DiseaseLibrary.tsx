import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Leaf, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Thermometer,
  Droplet,
  Wrench,
  ArrowLeft,
  BookOpen,
  TrendingUp,
  BarChart3,
  Eye
} from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlantType, setSelectedPlantType] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Format disease name for display
  const formatDiseaseName = (name: string) => {
    return name.replace(/_/g, ' ').replace('___', ' - ');
  };

  // Get severity color
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

  // Get unique severity levels
  const severityLevels = useMemo(() => {
    const levels = Array.from(new Set(diseases.map(d => d.severity_level).filter(Boolean)));
    return levels.sort((a, b) => {
      const order = ['none', 'low', 'moderate', 'moderate to high', 'high'];
      return order.indexOf(a.toLowerCase()) - order.indexOf(b.toLowerCase());
    });
  }, [diseases]);

  // Filter diseases based on search and filters
  const filteredDiseases = useMemo(() => {
    return diseases.filter(disease => {
      const matchesSearch = searchTerm === '' || 
        disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.plant_type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPlantType = selectedPlantType === 'all' || disease.plant_type === selectedPlantType;
      const matchesSeverity = selectedSeverity === 'all' || disease.severity_level === selectedSeverity;
      
      return matchesSearch && matchesPlantType && matchesSeverity;
    });
  }, [diseases, searchTerm, selectedPlantType, selectedSeverity]);

  // Get statistics
  const stats = useMemo(() => {
    const total = diseases.length;
    const healthy = diseases.filter(d => d.name.toLowerCase().includes('healthy')).length;
    const diseased = total - healthy;
    const plantTypeCounts = diseases.reduce((acc, disease) => {
      acc[disease.plant_type] = (acc[disease.plant_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total,
      healthy,
      diseased,
      plantTypes: Object.keys(plantTypeCounts).length,
      mostCommon: Object.entries(plantTypeCounts).sort(([,a], [,b]) => b - a).slice(0, 3)
    };
  }, [diseases]);

  return (
    <AppLayout>
      <Head title="Disease Library" />
      
      <div className="py-6 px-4 sm:px-6 lg:px-8 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard">
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-500" />
                Disease Library
              </h1>
              <p className="text-gray-400 mt-1">
                Comprehensive database of plant diseases and their treatments
              </p>
            </div>
            <Link href="/scan">
              <Button className="bg-green-600 hover:bg-green-700">
                <Leaf className="h-4 w-4 mr-2" />
                New Scan
              </Button>
            </Link>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-gray-400">Total Diseases</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">{stats.healthy}</div>
                <div className="text-sm text-gray-400">Healthy Conditions</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-amber-500">{stats.diseased}</div>
                <div className="text-sm text-gray-400">Disease Conditions</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-500">{stats.plantTypes}</div>
                <div className="text-sm text-gray-400">Plant Types</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search diseases, symptoms, or plant types..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <Select value={selectedPlantType} onValueChange={setSelectedPlantType}>
                  <SelectTrigger className="w-full md:w-[200px] bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Plant Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Plant Types</SelectItem>
                    {plantTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger className="w-full md:w-[200px] bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Severities</SelectItem>
                    {severityLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing {filteredDiseases.length} of {diseases.length} diseases
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-blue-600' : 'border-gray-700 text-white hover:bg-gray-800'}
                  >
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-blue-600' : 'border-gray-700 text-white hover:bg-gray-800'}
                  >
                    List
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disease Grid/List */}
          {filteredDiseases.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {filteredDiseases.map((disease, index) => (
                <motion.div
                  key={disease.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link href={`/diseases/${disease.id}`}>
                    <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer h-full">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            {disease.name.toLowerCase().includes('healthy') ? (
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                            )}
                            <Badge variant="outline" className="text-xs">
                              {disease.plant_type}
                            </Badge>
                          </div>
                          <Badge className={`text-xs ${getSeverityColor(disease.severity_level)}`}>
                            {disease.severity_level || 'Unknown'}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg text-white line-clamp-2">
                          {formatDiseaseName(disease.name)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                          {disease.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {disease.average_treatment_time > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {disease.average_treatment_time} weeks
                            </div>
                          )}
                          {disease.environmental_factors && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Thermometer className="h-3 w-3" />
                              Climate factors
                            </div>
                          )}
                          {disease.required_tools && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Wrench className="h-3 w-3" />
                              Tools needed
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-700">
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          {disease.source_url && (
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="text-blue-400 hover:text-blue-300 p-0"
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(disease.source_url!, '_blank');
                              }}
                            >
                              Learn More
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No diseases found</h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedPlantType('all');
                    setSelectedSeverity('all');
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/scan">
              <Card className="bg-green-600 hover:bg-green-700 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center text-white">
                  <Leaf className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Quick Diagnosis</h3>
                  <p className="text-sm text-green-100">Scan your plants now</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/history">
              <Card className="bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center text-white">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Your History</h3>
                  <p className="text-sm text-blue-100">View past scans</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/community">
              <Card className="bg-purple-600 hover:bg-purple-700 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center text-white">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Community</h3>
                  <p className="text-sm text-purple-100">Get help & share</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DiseaseLibrary; 