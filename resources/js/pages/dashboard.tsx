import React, { useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Leaf, AlertTriangle, CheckCircle, BarChart3, Database } from 'lucide-react';
import axios from 'axios';
import DiseaseDashboard from '@/components/dashboard/disease-dashboard';

interface DashboardProps {
  auth: any;
  stats: {
    total: number;
    healthy: number;
    diseased: number;
    successRate: number;
    commonDiseases: Array<{
      predicted_disease: string;
      count: number;
    }>;
  };
  history: {
    data: Array<{
      id: number;
      image_path: string;
      predicted_disease: string;
      confidence: number;
      created_at: string;
      disease: {
        id: number;
        name: string;
        description: string;
        treatment_suggestions: string;
      };
    }>;
  };
  diseases: Array<{
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
    statistics: any;
    source_url: string | null;
  }>;
}

const Dashboard: React.FC<DashboardProps> = ({ auth, stats, history, diseases }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTestModel = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const response = await axios.post('/api/test-model');
      setTestResult(response.data.output);
    } catch (err: any) {
      const errorOutput = err.response?.data?.error_output || 'No error details provided.';
      const output = err.response?.data?.output || 'No output from script.';
      const errorMessage = err.response?.data?.error || 'An unknown error occurred.';
      setTestResult(
        `-- ERROR --\n${errorMessage}\n\n-- SCRIPT OUTPUT --\n${output}\n\n-- ERROR STREAM --\n${errorOutput}`,
      );
    } finally {
      setIsTesting(false);
    }
  };

  // Format disease name for display
  const formatDiseaseName = (name: string) => {
    return name.replace(/_/g, ' ').replace('___', ' - ');
  };

  return (
    <AppLayout>
      <Head title="Dashboard" />
      
      <div className="py-6 px-4 sm:px-6 lg:px-8 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Plant Health Dashboard</h1>
              <p className="text-gray-400">Monitor your plant health and get detailed insights</p>
            </div>
            
            <div>
              <Link href="/scan">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Leaf className="h-4 w-4 mr-2" />
                  New Scan
                </Button>
              </Link>
            </div>
          </div>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-gray-900 border border-gray-800">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gray-800">
                Overview
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-gray-800">
                Scan History
              </TabsTrigger>
              <TabsTrigger value="statistics" className="data-[state=active]:bg-gray-800">
                Disease Statistics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">Total Scans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-white">{stats.total}</div>
                      <BarChart3 className="h-8 w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">Healthy Plants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-green-500">{stats.healthy}</div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      {stats.successRate}% of your plants are healthy
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">Diseased Plants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-amber-500">{stats.diseased}</div>
                      <AlertTriangle className="h-8 w-8 text-amber-500" />
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      {stats.diseased > 0 ? 'Requires attention' : 'No diseases detected'}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Scans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {history.data.length > 0 ? (
                        history.data.slice(0, 5).map((scan) => (
                          <Link 
                            key={scan.id} 
                            href={`/scan/${scan.id}`}
                            className="flex items-center gap-4 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                          >
                            <div className="h-12 w-12 rounded-md overflow-hidden">
                              <img 
                                src={`/storage/${scan.image_path}`} 
                                alt="Plant scan" 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {formatDiseaseName(scan.predicted_disease)}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(scan.created_at).toLocaleString()}
                              </p>
                            </div>
                            <Badge 
                              variant={scan.predicted_disease.includes('healthy') ? "success" : "destructive"}
                              className="ml-auto"
                            >
                              {Math.round(scan.confidence * 100)}%
                            </Badge>
                          </Link>
                        ))
                      ) : (
                        <p className="text-gray-400 text-center py-4">No scan history available</p>
                      )}
                      
                      {history.data.length > 5 && (
                        <div className="text-center pt-2">
                          <Button 
                            variant="link" 
                            className="text-blue-400 hover:text-blue-300"
                            onClick={() => setActiveTab('history')}
                          >
                            View all scans
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Common Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.commonDiseases && stats.commonDiseases.length > 0 ? (
                      <div className="space-y-4">
                        {stats.commonDiseases.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {item.predicted_disease.includes('healthy') ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                              )}
                              <span className="text-sm text-white">
                                {formatDiseaseName(item.predicted_disease)}
                              </span>
                            </div>
                            <Badge variant="outline" className="bg-gray-800">
                              {item.count} {item.count === 1 ? 'scan' : 'scans'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center py-4">No data available</p>
                    )}
                    
                    <div className="mt-6">
                      <Link href="/disease-library">
                        <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">
                          View Disease Library
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Scan History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {history.data.length > 0 ? (
                      history.data.map((scan) => (
                        <Link 
                          key={scan.id} 
                          href={`/scan/${scan.id}`}
                          className="flex items-center gap-4 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                        >
                          <div className="h-12 w-12 rounded-md overflow-hidden">
                            <img 
                              src={`/storage/${scan.image_path}`} 
                              alt="Plant scan" 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {formatDiseaseName(scan.predicted_disease)}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(scan.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={scan.predicted_disease.includes('healthy') ? "success" : "destructive"}
                              className="mb-1"
                            >
                              {Math.round(scan.confidence * 100)}%
                            </Badge>
                            <p className="text-xs text-gray-400">
                              {scan.disease?.description?.substring(0, 50)}...
                            </p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-400 text-center py-4">No scan history available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="statistics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Diagnosed Diseases</CardTitle>
                    <p className="text-sm text-gray-400">Diseases detected through your scans</p>
                  </CardHeader>
                  <CardContent>
                    {diseases.length > 0 ? (
                      <div className="space-y-4">
                        {diseases.map((disease) => (
                          <div key={disease.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <div className="flex items-center gap-3">
                              {disease.name.toLowerCase().includes('healthy') ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                              )}
                              <div>
                                <p className="text-sm font-medium text-white">
                                  {formatDiseaseName(disease.name)}
                                </p>
                                <p className="text-xs text-gray-400">{disease.plant_type}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {disease.severity_level}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">No diseases detected yet</p>
                        <p className="text-sm text-gray-500 mt-2">Start scanning your plants to see diagnosed diseases here</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Disease Library</CardTitle>
                    <p className="text-sm text-gray-400">Complete reference for all plant diseases</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-300">
                        Access our comprehensive disease library with detailed information about symptoms, treatments, and prevention methods.
                      </p>
                      <Link href="/disease-library">
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <Database className="h-4 w-4 mr-2" />
                          View Disease Library
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
