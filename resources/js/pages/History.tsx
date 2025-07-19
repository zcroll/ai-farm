import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';

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
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Scan History" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h1 className="text-2xl font-bold">Scan History</h1>
                <p className="text-muted-foreground mb-4">View all your previous plant scans</p>

                <Card className="p-4">
                    {scans.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-muted">
                                        <th className="p-2 text-left">Image</th>
                                        <th className="p-2 text-left">Prediction</th>
                                        <th className="p-2 text-left">Confidence</th>
                                        <th className="p-2 text-left">Date</th>
                                        <th className="p-2 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scans.data.map((scan) => (
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
                                                {format(new Date(scan.created_at), 'PPP p')}
                                            </td>
                                            <td className="p-2">
                                                <Link href={`/scan/${scan.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">No scan history yet. Upload your first plant image!</p>
                            <Link href="/dashboard">
                                <Button className="mt-4">Go to Dashboard</Button>
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {scans.last_page > 1 && (
                        <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-muted-foreground">
                                Page {scans.current_page} of {scans.last_page}
                            </div>
                            <div className="flex gap-2">
                                {scans.prev_page_url && (
                                    <Link href={scans.prev_page_url}>
                                        <Button variant="outline" size="sm">
                                            Previous
                                        </Button>
                                    </Link>
                                )}
                                {scans.next_page_url && (
                                    <Link href={scans.next_page_url}>
                                        <Button variant="outline" size="sm">
                                            Next
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
} 