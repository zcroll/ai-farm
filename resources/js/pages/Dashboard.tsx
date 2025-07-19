import React, { useState, useRef } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import PlantScanner from '@/components/plant-scanner';
import { type BreadcrumbItem } from '@/types';

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
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {/* Stats Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card className="flex flex-col items-center justify-center p-4">
                        <h3 className="text-2xl font-bold">{stats.total}</h3>
                        <p className="text-muted-foreground">Total Scans</p>
                    </Card>
                    <Card className="flex flex-col items-center justify-center p-4">
                        <h3 className="text-2xl font-bold">{stats.healthy}</h3>
                        <p className="text-muted-foreground">Healthy Plants</p>
                    </Card>
                    <Card className="flex flex-col items-center justify-center p-4">
                        <h3 className="text-2xl font-bold">{stats.diseased}</h3>
                        <p className="text-muted-foreground">Diseased Plants</p>
                    </Card>
                </div>

                {/* Plant Disease Detection */}
                <PlantScanner />

                {/* Scan History */}
                <Card className="p-4">
                    <h2 className="text-xl font-bold mb-4">Scan History</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-muted">
                                    <th className="p-2 text-left">Image</th>
                                    <th className="p-2 text-left">Prediction</th>
                                    <th className="p-2 text-left">Confidence</th>
                                    <th className="p-2 text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.data.length > 0 ? (
                                    history.data.map((scan) => (
                                        <tr key={scan.id} className="border-b">
                                            <td className="p-2">
                                                <img
                                                    src={`/storage/${scan.image_path}`}
                                                    alt="Scan"
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                            </td>
                                            <td className="p-2">{scan.predicted_disease.replace(/_/g, ' ')}</td>
                                            <td className="p-2">
                                                {(scan.confidence * 100).toFixed(2)}%
                                            </td>
                                            <td className="p-2">
                                                {new Date(scan.created_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="p-4 text-center">
                                            No scan history yet. Upload your first plant image!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {(history.prev_page_url || history.next_page_url) && (
                        <div className="mt-4 flex justify-between">
                            {history.prev_page_url ? (
                                <a href={history.prev_page_url}>
                                    <button className="px-4 py-2 border rounded">Previous</button>
                                </a>
                            ) : (
                                <div></div>
                            )}
                            {history.next_page_url && (
                                <a href={history.next_page_url}>
                                    <button className="px-4 py-2 border rounded">Next</button>
                                </a>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
