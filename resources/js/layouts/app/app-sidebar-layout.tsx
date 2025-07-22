import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AIChatWidget from '@/components/ai-chat-widget';
import QuickScanFab from '@/components/quick-scan-fab';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { url, props } = usePage();

    // Don't show the FAB on the scan page itself
    const showQuickScanFab = !url.startsWith('/scan');

    // Extract user scans and diseases from page props if available
    const userScans = (props as any)?.history?.data || (props as any)?.scans?.data || [];
    const userDiseases = (props as any)?.diseases || [];

    return (
        <>
            <AppShell variant="sidebar">
                <AppSidebar />
                <AppContent variant="sidebar" className="overflow-x-hidden">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    {children}
                </AppContent>
            </AppShell>
            <AIChatWidget
                userScans={userScans}
                userDiseases={userDiseases}
            />
            {showQuickScanFab && <QuickScanFab />}
        </>
    );
}
