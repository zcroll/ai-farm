import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Leaf } from 'lucide-react';

interface Disease {
    id: number;
    name: string;
    plant_type: string;
    description: string;
    severity_level: string;
    average_treatment_time: number;
}

interface Props {
    diseases: {
        data: Disease[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    plantTypes: string[];
    filters: {
        search?: string;
        plant_type?: string;
    };
}

export default function DiseaseLibrary({ diseases, plantTypes, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [plantType, setPlantType] = useState(filters.plant_type || 'all');
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (plantType && plantType !== 'all') params.set('plant_type', plantType);

        router.get('/diseases', params.toString(), {
            preserveState: true,
            replace: true,
        });
    }, [debouncedSearch, plantType]);

    const getSeverityColor = (severity: string) => {
        switch (severity?.toLowerCase()) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatPlantType = (type: string) => {
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <AppSidebarLayout>
            <Head title="Disease Library" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Disease Library</h1>
                        <p className="text-gray-600 mt-2">
                            Comprehensive guide to plant diseases, symptoms, and treatments
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Leaf className="h-8 w-8 text-green-600" />
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search diseases..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="w-full sm:w-48">
                                <Select value={plantType} onValueChange={setPlantType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Plant Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Plants</SelectItem>
                                        {plantTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {formatPlantType(type)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Count */}
                <div className="flex items-center justify-between">
                    <p className="text-gray-600">
                        Showing {diseases.data.length} of {diseases.total} diseases
                    </p>
                </div>

                {/* Disease Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {diseases.data.map((disease) => (
                        <Card key={disease.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg font-semibold text-gray-900">
                                        {disease.name.replace(/_/g, ' ')}
                                    </CardTitle>
                                    <Badge className={getSeverityColor(disease.severity_level)}>
                                        {disease.severity_level || 'Unknown'}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {formatPlantType(disease.plant_type)}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                                    {disease.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        {disease.average_treatment_time ? (
                                            <span>~{disease.average_treatment_time} days treatment</span>
                                        ) : (
                                            <span>Treatment time varies</span>
                                        )}
                                    </div>
                                    <Link href={`/diseases/${disease.id}`}>
                                        <Button variant="outline" size="sm">
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {diseases.last_page > 1 && (
                    <div className="flex items-center justify-center space-x-2">
                        {diseases.current_page > 1 && (
                            <Button
                                variant="outline"
                                onClick={() => router.get('/diseases', { page: diseases.current_page - 1, ...filters })}
                            >
                                Previous
                            </Button>
                        )}
                        
                        <span className="text-sm text-gray-600">
                            Page {diseases.current_page} of {diseases.last_page}
                        </span>
                        
                        {diseases.current_page < diseases.last_page && (
                            <Button
                                variant="outline"
                                onClick={() => router.get('/diseases', { page: diseases.current_page + 1, ...filters })}
                            >
                                Next
                            </Button>
                        )}
                    </div>
                )}

                {diseases.data.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No diseases found</h3>
                            <p className="text-gray-600">
                                Try adjusting your search criteria or filters
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppSidebarLayout>
    );
}