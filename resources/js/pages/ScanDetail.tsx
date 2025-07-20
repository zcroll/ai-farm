import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Leaf, AlertTriangle, CheckCircle, Thermometer, Clock, Map, Droplet, Wrench } from 'lucide-react';
import React, { useState } from 'react';

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
    user_id: number;
    disease_id: number;
    image_path: string;
    predicted_disease: string;
    confidence: number;
    created_at: string;
    updated_at: string;
    disease: Disease;
}

interface ScanDetailProps {
    scan: Scan;
    relatedDiseases?: Disease[];
}

export default function ScanDetail({ scan, relatedDiseases = [] }: ScanDetailProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const formattedDate = new Date(scan.created_at).toLocaleString();
    const diseaseName = scan.predicted_disease.replace(/_/g, ' ').replace('___', ' - ');
    const confidencePercentage = (scan.confidence * 100).toFixed(2);
    const isHealthy = scan.predicted_disease.includes('healthy');

    // Helper function to get severity color
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

    // Extract plant and condition from name
    const parts = scan.predicted_disease.split('___');
    const plant = parts[0].replace(/_/g, ' ');
    const condition = parts.length > 1 ? parts[1].replace(/_/g, ' ') : '';

    // Format seasonal prevalence data for visualization
    const seasonalData = scan.disease.seasonal_prevalence || {};
    const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'History',
            href: '/history',
        },
        {
            title: `Scan #${scan.id}`,
            href: `/scan/${scan.id}`,
        },
    ];

    return (
        <AppLayout>
            <Head title={`Scan Details - ${diseaseName}`} />
            <div className="py-6 px-4 sm:px-6 lg:px-8 bg-black min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Scan Details</h1>
                            <p className="text-gray-400">Scan completed on {formattedDate}</p>
                        </div>
                        <Link href="/history">
                            <Button variant="outline" className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800">
                                Back to History
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <Card className="md:col-span-1 bg-black border-gray-800 text-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Leaf className="h-5 w-5 text-green-500" />
                                    Plant Image
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="flex justify-center">
                                    <img 
                                        src={`/storage/${scan.image_path}`} 
                                        alt={diseaseName}
                                        className="max-w-full max-h-[400px] object-contain rounded-md border border-gray-700"
                                    />
                                </div>
                                <div className="mt-4">
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <Badge variant={isHealthy ? "success" : "default"} className="text-xs">
                                            {plant}
                                        </Badge>
                                        {!isHealthy && (
                                            <Badge variant="destructive" className="text-xs">
                                                {condition}
                                            </Badge>
                                        )}
                                        {scan.disease.severity_level && (
                                            <Badge variant="outline" className="text-xs">
                                                Severity: {scan.disease.severity_level}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2 bg-black border-gray-800 text-white">
                            <CardHeader className="pb-2 border-b border-gray-800">
                                <div className="flex items-center gap-2">
                                    {isHealthy ? (
                                        <CheckCircle className="h-6 w-6 text-green-500" />
                                    ) : (
                                        <AlertTriangle className="h-6 w-6 text-amber-500" />
                                    )}
                                    <CardTitle className="text-xl">
                                        {diseaseName}
                                    </CardTitle>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-sm text-gray-400">Confidence:</span>
                                    <div className="flex-1 bg-gray-700 h-2 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${isHealthy ? 'bg-green-500' : 'bg-amber-500'} rounded-full`}
                                            style={{ width: `${confidencePercentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-white">{confidencePercentage}%</span>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="pt-4">
                                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                                    <TabsList className="bg-gray-900 border border-gray-800">
                                        <TabsTrigger value="overview" className="data-[state=active]:bg-gray-800">
                                            Overview
                                        </TabsTrigger>
                                        <TabsTrigger value="details" className="data-[state=active]:bg-gray-800">
                                            Scientific Details
                                        </TabsTrigger>
                                        <TabsTrigger value="treatment" className="data-[state=active]:bg-gray-800">
                                            Treatment
                                        </TabsTrigger>
                                    </TabsList>
                                    
                                    <TabsContent value="overview" className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2 text-white">Description</h3>
                                            <p className="text-gray-300">{scan.disease.description}</p>
                                        </div>
                                        
                                        {scan.disease.environmental_factors && (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-white">
                                                    <Thermometer className="h-4 w-4 text-blue-400" />
                                                    Environmental Factors
                                                </h3>
                                                <p className="text-gray-300">{scan.disease.environmental_factors}</p>
                                            </div>
                                        )}
                                        
                                        {scan.disease.seasonal_prevalence && Object.keys(scan.disease.seasonal_prevalence).length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3 text-white">Seasonal Prevalence</h3>
                                                <div className="space-y-3">
                                                    {seasons.map(season => {
                                                        const prevalenceValue = seasonalData[season] || '';
                                                        let colorClass = 'bg-green-500';
                                                        
                                                        if (prevalenceValue === 'High' || prevalenceValue === 'Very High') {
                                                            colorClass = 'bg-red-500';
                                                        } else if (prevalenceValue === 'Moderate') {
                                                            colorClass = 'bg-yellow-500';
                                                        }
                                                        
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
                                            </div>
                                        )}
                                    </TabsContent>
                                    
                                    <TabsContent value="details" className="space-y-4">
                                        {scan.disease.scientific_details && (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2 text-white">Scientific Details</h3>
                                                <p className="text-gray-300">{scan.disease.scientific_details}</p>
                                            </div>
                                        )}
                                        
                                        {scan.disease.statistics && Object.keys(scan.disease.statistics).length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3 text-white">Statistics</h3>
                                                <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                                                    <ul className="space-y-2 text-sm text-gray-300">
                                                        {scan.disease.statistics.infection_rate && (
                                                            <li className="flex justify-between">
                                                                <span>Infection Rate:</span>
                                                                <span className="font-medium">{scan.disease.statistics.infection_rate}</span>
                                                            </li>
                                                        )}
                                                        {scan.disease.statistics.yield_impact && (
                                                            <li className="flex justify-between">
                                                                <span>Yield Impact:</span>
                                                                <span className="font-medium">{scan.disease.statistics.yield_impact}</span>
                                                            </li>
                                                        )}
                                                        {scan.disease.statistics.treatment_success_rate && (
                                                            <li className="flex justify-between">
                                                                <span>Treatment Success:</span>
                                                                <span className="font-medium">{scan.disease.statistics.treatment_success_rate}</span>
                                                            </li>
                                                        )}
                                                        {scan.disease.statistics.productivity && (
                                                            <li className="flex justify-between">
                                                                <span>Productivity:</span>
                                                                <span className="font-medium">{scan.disease.statistics.productivity}</span>
                                                            </li>
                                                        )}
                                                        {scan.disease.statistics.lifespan && (
                                                            <li className="flex justify-between">
                                                                <span>Lifespan:</span>
                                                                <span className="font-medium">{scan.disease.statistics.lifespan}</span>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {scan.disease.statistics?.common_regions && scan.disease.statistics.common_regions.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                                                    <Map className="h-4 w-4 text-indigo-400" />
                                                    Common Regions
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {scan.disease.statistics.common_regions.map((region, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {region}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {scan.disease.statistics?.common_varieties && scan.disease.statistics.common_varieties.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                                                    <Droplet className="h-4 w-4 text-cyan-400" />
                                                    Common Varieties
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {scan.disease.statistics.common_varieties.map((variety, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs bg-gray-800 text-gray-200">
                                                            {variety}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>
                                    
                                    <TabsContent value="treatment" className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2 text-white">Treatment Suggestions</h3>
                                            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                                                <p className="text-gray-300">{scan.disease.treatment_suggestions}</p>
                                            </div>
                                        </div>
                                        
                                        {scan.disease.prevention_methods && (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2 text-white">Prevention Methods</h3>
                                                <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                                                    <p className="text-gray-300">{scan.disease.prevention_methods}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {scan.disease.required_tools && (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-white">
                                                    <Wrench className="h-4 w-4 text-orange-400" />
                                                    Required Tools
                                                </h3>
                                                <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                                                    <p className="text-gray-300">{scan.disease.required_tools}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {scan.disease.average_treatment_time > 0 && (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                                                    <Clock className="h-4 w-4 text-purple-400" />
                                                    Treatment Time
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden flex-1">
                                                        <div 
                                                            className="h-full bg-purple-500 rounded-full"
                                                            style={{ width: `${scan.disease.average_treatment_time * 20}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-gray-300 whitespace-nowrap">
                                                        {scan.disease.average_treatment_time} weeks
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {scan.disease.source_url && (
                                            <div className="mt-4">
                                                <a 
                                                    href={scan.disease.source_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                                >
                                                    Learn More
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                    
                    {relatedDiseases && relatedDiseases.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-white mb-4">Related Conditions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {relatedDiseases.map(disease => (
                                    <Card key={disease.id} className="bg-gray-900 border-gray-800 text-white hover:border-gray-700 transition-colors">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                {disease.name.toLowerCase().includes('healthy') ? (
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                )}
                                                {disease.name.replace(/_/g, ' ').replace('___', ' - ')}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-2">
                                            <p className="text-sm text-gray-400 line-clamp-3">{disease.description}</p>
                                            
                                            <div className="flex justify-between items-center mt-4">
                                                {disease.severity_level && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {disease.severity_level}
                                                    </Badge>
                                                )}
                                                
                                                <Link href={`/diseases/${disease.id}`}>
                                                    <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0 h-auto">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="flex justify-center mt-8">
                        <Link href="/predictions/create">
                            <Button className="bg-green-600 hover:bg-green-700">
                                <Leaf className="h-4 w-4 mr-2" />
                                Scan Another Plant
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 