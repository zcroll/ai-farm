import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { Leaf, AlertTriangle, CheckCircle, ArrowLeft, Filter, Search } from 'lucide-react';
import React, { useState } from 'react';

interface Disease {
    id: number;
    name: string;
    description: string;
    treatment_suggestions: string;
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

interface HistoryProps {
    scans: {
        data: Scan[];
        links: any[];
        prev_page_url: string | null;
        next_page_url: string | null;
        current_page: number;
        last_page: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'History',
        href: '/history',
    },
];

export default function History({ scans }: HistoryProps) {
    const [filter, setFilter] = useState('all'); // all, healthy, diseased
    
    const formatDiseaseName = (name: string) => {
        return name.replace(/_/g, ' ').replace('___', ' - ');
    };

    const filteredScans = scans.data.filter(scan => {
        if (filter === 'healthy') return scan.predicted_disease.includes('healthy');
        if (filter === 'diseased') return !scan.predicted_disease.includes('healthy');
        return true;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Scan History" />
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
                                <Leaf className="h-6 w-6 text-green-500" />
                                Scan History
                            </h1>
                            <p className="text-gray-400 mt-1">View and manage all your plant health scans</p>
                        </div>
                        <Link href="/scan">
                            <Button className="bg-green-600 hover:bg-green-700">
                                <Leaf className="h-4 w-4 mr-2" />
                                New Scan
                            </Button>
                        </Link>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex gap-2 mb-6">
                        <Button
                            variant={filter === 'all' ? 'default' : 'outline'}
                            onClick={() => setFilter('all')}
                            className={filter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-700 text-white hover:bg-gray-800'}
                        >
                            All Scans ({scans.data.length})
                        </Button>
                        <Button
                            variant={filter === 'healthy' ? 'default' : 'outline'}
                            onClick={() => setFilter('healthy')}
                            className={filter === 'healthy' ? 'bg-green-600 hover:bg-green-700' : 'border-gray-700 text-white hover:bg-gray-800'}
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Healthy ({scans.data.filter(s => s.predicted_disease.includes('healthy')).length})
                        </Button>
                        <Button
                            variant={filter === 'diseased' ? 'default' : 'outline'}
                            onClick={() => setFilter('diseased')}
                            className={filter === 'diseased' ? 'bg-amber-600 hover:bg-amber-700' : 'border-gray-700 text-white hover:bg-gray-800'}
                        >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Diseased ({scans.data.filter(s => !s.predicted_disease.includes('healthy')).length})
                        </Button>
                    </div>

                    {/* Scan Grid */}
                    {filteredScans.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredScans.map((scan) => (
                                <Link key={scan.id} href={`/scan/${scan.id}`}>
                                    <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <Badge 
                                                    variant={scan.predicted_disease.includes('healthy') ? "success" : "destructive"}
                                                    className="mb-2"
                                                >
                                                    {Math.round(scan.confidence * 100)}% confidence
                                                </Badge>
                                                <div className="text-xs text-gray-400">
                                                    {format(new Date(scan.created_at), 'MMM dd, yyyy')}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="aspect-square rounded-lg overflow-hidden border border-gray-700">
                                                <img
                                                    src={`/storage/${scan.image_path}`}
                                                    alt="Plant scan"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-white mb-1 flex items-center gap-2">
                                                    {scan.predicted_disease.includes('healthy') ? (
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                    )}
                                                    {formatDiseaseName(scan.predicted_disease)}
                                                </h3>
                                                {scan.disease?.description && (
                                                    <p className="text-xs text-gray-400 line-clamp-2">
                                                        {scan.disease.description.substring(0, 100)}...
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <Card className="bg-gray-900 border-gray-800">
                            <CardContent className="text-center py-12">
                                <Leaf className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">
                                    {filter === 'all' ? 'No scans yet' : `No ${filter} scans found`}
                                </h3>
                                <p className="text-gray-400 mb-6">
                                    {filter === 'all' 
                                        ? 'Start scanning your plants to build your health monitoring history'
                                        : `Try changing the filter or scan more plants to see ${filter} results`
                                    }
                                </p>
                                <Link href="/scan">
                                    <Button className="bg-green-600 hover:bg-green-700">
                                        <Leaf className="h-4 w-4 mr-2" />
                                        Start Scanning
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pagination */}
                    {scans.last_page > 1 && (
                        <div className="flex justify-between items-center mt-8">
                            <div className="text-sm text-gray-400">
                                Page {scans.current_page} of {scans.last_page} ({scans.data.length} scans)
                            </div>
                            <div className="flex gap-2">
                                {scans.prev_page_url && (
                                    <Link href={scans.prev_page_url}>
                                        <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-800">
                                            Previous
                                        </Button>
                                    </Link>
                                )}
                                {scans.next_page_url && (
                                    <Link href={scans.next_page_url}>
                                        <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-800">
                                            Next
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
} 