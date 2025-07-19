import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    ArrowLeft, 
    Leaf, 
    Clock, 
    AlertTriangle, 
    Shield, 
    Wrench, 
    Thermometer,
    Calendar,
    BarChart3
} from 'lucide-react';

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
    source_url: string;
}

interface Props {
    disease: Disease;
}

export default function DiseaseDetail({ disease }: Props) {
    const getSeverityColor = (severity: string) => {
        switch (severity?.toLowerCase()) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatPlantType = (type: string) => {
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatDiseaseName = (name: string) => {
        return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <AppSidebarLayout>
            <Head title={`${formatDiseaseName(disease.name)} - Disease Library`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Link href="/diseases">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Library
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {formatDiseaseName(disease.name)}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {formatPlantType(disease.plant_type)}
                        </p>
                    </div>
                    <Badge className={`${getSeverityColor(disease.severity_level)} border`}>
                        {disease.severity_level || 'Unknown'} Severity
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Leaf className="h-5 w-5 text-green-600" />
                                    <span>Description</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed">
                                    {disease.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Scientific Details */}
                        {disease.scientific_details && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <BarChart3 className="h-5 w-5 text-blue-600" />
                                        <span>Scientific Details</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 leading-relaxed">
                                        {disease.scientific_details}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Treatment Suggestions */}
                        {disease.treatment_suggestions && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Wrench className="h-5 w-5 text-orange-600" />
                                        <span>Treatment</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-sm max-w-none">
                                        <div 
                                            className="text-gray-700 leading-relaxed"
                                            dangerouslySetInnerHTML={{ 
                                                __html: disease.treatment_suggestions.replace(/\n/g, '<br>') 
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Prevention Methods */}
                        {disease.prevention_methods && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Shield className="h-5 w-5 text-green-600" />
                                        <span>Prevention</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-sm max-w-none">
                                        <div 
                                            className="text-gray-700 leading-relaxed"
                                            dangerouslySetInnerHTML={{ 
                                                __html: disease.prevention_methods.replace(/\n/g, '<br>') 
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Environmental Factors */}
                        {disease.environmental_factors && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Thermometer className="h-5 w-5 text-purple-600" />
                                        <span>Environmental Factors</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 leading-relaxed">
                                        {disease.environmental_factors}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Plant Type:</span>
                                    <span className="text-sm font-medium">
                                        {formatPlantType(disease.plant_type)}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Severity:</span>
                                    <Badge className={getSeverityColor(disease.severity_level)}>
                                        {disease.severity_level || 'Unknown'}
                                    </Badge>
                                </div>

                                {disease.average_treatment_time && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Treatment Time:</span>
                                        <span className="text-sm font-medium flex items-center">
                                            <Clock className="h-4 w-4 mr-1" />
                                            ~{disease.average_treatment_time} days
                                        </span>
                                    </div>
                                )}

                                {disease.required_tools && (
                                    <div className="flex items-start justify-between">
                                        <span className="text-sm text-gray-600">Tools Needed:</span>
                                        <span className="text-sm font-medium text-right max-w-xs">
                                            {disease.required_tools}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Seasonal Prevalence */}
                        {disease.seasonal_prevalence && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                        <span>Seasonal Prevalence</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {Object.entries(disease.seasonal_prevalence).map(([season, level]) => (
                                            <div key={season} className="flex items-center justify-between">
                                                <span className="text-sm capitalize">{season}:</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {level as string}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Statistics */}
                        {disease.statistics && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Statistics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {Object.entries(disease.statistics).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 capitalize">
                                                    {key.replace(/_/g, ' ')}:
                                                </span>
                                                <span className="text-sm font-medium">{value as string}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Source */}
                        {disease.source_url && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Source</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <a 
                                        href={disease.source_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                                    >
                                        View Source
                                    </a>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center space-x-4 pt-6 border-t">
                    <Link href="/dashboard">
                        <Button>
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Scan My Plant
                        </Button>
                    </Link>
                    <Link href="/community">
                        <Button variant="outline">
                            Ask Community
                        </Button>
                    </Link>
                </div>
            </div>
        </AppSidebarLayout>
    );
}