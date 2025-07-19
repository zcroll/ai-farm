import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { router } from '@inertiajs/react';

interface Disease {
    id: number;
    name: string;
    description: string;
    plant_type: string;
    severity_level: string;
    views_count: number;
    symptoms?: string;
    causes?: string;
}

interface DiseaseLibraryProps {
    diseases: {
        data: Disease[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        plant_type?: string;
        severity?: string;
        sort_by: string;
        sort_order: string;
    };
    plantTypes: string[];
    severityLevels: string[];
}

export default function DiseaseLibrary({ diseases, filters, plantTypes, severityLevels }: DiseaseLibraryProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [plantType, setPlantType] = useState(filters.plant_type || '');
    const [severity, setSeverity] = useState(filters.severity || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'name');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'asc');

    const applyFilters = () => {
        router.get('/disease-library', {
            search,
            plant_type: plantType,
            severity,
            sort_by: sortBy,
            sort_order: sortOrder,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setPlantType('');
        setSeverity('');
        setSortBy('name');
        setSortOrder('asc');
        router.get('/disease-library', {}, { preserveState: true, replace: true });
    };

    const getSeverityColor = (severity: string) => {
        switch (severity?.toLowerCase()) {
            case 'low':
                return 'bg-green-100 text-green-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'high':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <Head title="Disease Library" />
            
            <div className="container mx-auto px-4 py-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Disease Library</h1>
                    <p className="text-muted-foreground">
                        Comprehensive information about plant diseases, symptoms, and treatments
                    </p>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search diseases..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Plant Type</label>
                                <Select value={plantType} onValueChange={setPlantType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All plant types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All plant types</SelectItem>
                                        {plantTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Severity</label>
                                <Select value={severity} onValueChange={setSeverity}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All severities" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All severities</SelectItem>
                                        {severityLevels.map((level) => (
                                            <SelectItem key={level} value={level}>
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Sort By</label>
                                <div className="flex gap-2">
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="name">Name</SelectItem>
                                            <SelectItem value="plant_type">Plant Type</SelectItem>
                                            <SelectItem value="severity_level">Severity</SelectItem>
                                            <SelectItem value="popularity">Popularity</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    >
                                        {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <Button onClick={applyFilters}>Apply Filters</Button>
                            <Button variant="outline" onClick={clearFilters}>Clear All</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-muted-foreground">
                            Showing {diseases.data.length} of {diseases.total} diseases
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {diseases.data.map((disease) => (
                            <Card key={disease.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg mb-2">{disease.name}</CardTitle>
                                            <div className="flex gap-2 mb-2">
                                                {disease.plant_type && (
                                                    <Badge variant="secondary">{disease.plant_type}</Badge>
                                                )}
                                                {disease.severity_level && (
                                                    <Badge className={getSeverityColor(disease.severity_level)}>
                                                        {disease.severity_level}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {disease.views_count} views
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="mb-4 line-clamp-3">
                                        {disease.description}
                                    </CardDescription>
                                    
                                    {disease.symptoms && (
                                        <div className="mb-3">
                                            <h4 className="text-sm font-medium mb-1">Symptoms:</h4>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {disease.symptoms}
                                            </p>
                                        </div>
                                    )}

                                    <Button
                                        onClick={() => router.visit(`/disease-library/${disease.id}`)}
                                        className="w-full"
                                    >
                                        View Details
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {diseases.data.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No diseases found matching your criteria.</p>
                            <Button variant="outline" onClick={clearFilters} className="mt-4">
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {diseases.last_page > 1 && (
                    <div className="flex justify-center">
                        <div className="flex gap-2">
                            {Array.from({ length: diseases.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === diseases.current_page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => router.get('/disease-library', { 
                                        ...filters, 
                                        page 
                                    }, { preserveState: true })}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}