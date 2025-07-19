import React, { useState, useRef } from 'react';
import { Head } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PlantScanner from '@/components/plant-scanner';
import { Badge } from '@/components/ui/badge';
import { 
    Camera, 
    TrendingUp, 
    CheckCircle, 
    AlertTriangle, 
    Clock,
    Calendar
} from 'lucide-react';

interface ScanHistoryItem {
    id: number;
    image_path: string;
    predicted_disease: string;
    confidence: number;
    created_at: string;
    disease: {
        name: string;
        description: string;
        treatment_suggestions: string;
        source_url: string | null;
    };
}

interface DashboardProps {
    auth: {
        user: {
            name: string;
        };
    };
    stats: {
        total: number;
        healthy: number;
        diseased: number;
    };
    history: {
        data: ScanHistoryItem[];
        links: any[];
        prev_page_url: string | null;
        next_page_url: string | null;
    };
}

export default function Dashboard({ auth, stats, history }: DashboardProps) {
    return (
        <AppSidebarLayout>
            <Head title="Dashboard" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-2">
                            Welcome back, {auth.user.name}! Monitor your plant health and track your scans.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Camera className="h-8 w-8 text-green-600" />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <TrendingUp className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Scans</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Healthy Plants</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.healthy}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-red-100 rounded-full">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Diseases Detected</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.diseased}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Plant Scanner */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Camera className="h-5 w-5 text-green-600" />
                            <span>Plant Disease Scanner</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PlantScanner />
                    </CardContent>
                </Card>

                {/* Scan History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-blue-600" />
                            <span>Recent Scans</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3 font-medium text-gray-600">Image</th>
                                        <th className="text-left p-3 font-medium text-gray-600">Prediction</th>
                                        <th className="text-left p-3 font-medium text-gray-600">Confidence</th>
                                        <th className="text-left p-3 font-medium text-gray-600">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.data.length > 0 ? (
                                        history.data.map((scan) => (
                                            <tr key={scan.id} className="border-b hover:bg-gray-50">
                                                <td className="p-3">
                                                    <img
                                                        src={`/storage/${scan.image_path}`}
                                                        alt="Scan"
                                                        className="w-16 h-16 object-cover rounded-md"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {scan.predicted_disease.replace(/_/g, ' ')}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {scan.disease?.description?.substring(0, 50)}...
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <Badge 
                                                        className={
                                                            scan.confidence > 0.8 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : scan.confidence > 0.6 
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }
                                                    >
                                                        {(scan.confidence * 100).toFixed(1)}%
                                                    </Badge>
                                                </td>
                                                <td className="p-3 text-sm text-gray-600">
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>
                                                            {new Date(scan.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-gray-500">
                                                <div className="flex flex-col items-center space-y-2">
                                                    <Camera className="h-12 w-12 text-gray-300" />
                                                    <p>No scan history yet</p>
                                                    <p className="text-sm">Upload your first plant image to get started!</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        {(history.prev_page_url || history.next_page_url) && (
                            <div className="mt-6 flex justify-between items-center">
                                {history.prev_page_url ? (
                                    <a 
                                        href={history.prev_page_url}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Previous
                                    </a>
                                ) : (
                                    <div></div>
                                )}
                                {history.next_page_url && (
                                    <a 
                                        href={history.next_page_url}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Next
                                    </a>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
