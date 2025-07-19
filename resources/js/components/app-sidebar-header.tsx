import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';

export function AppSidebarHeader() {
    return (
        <div className="flex h-14 items-center border-b border-sidebar-border px-4">
            <Link href="/" className="flex items-center gap-2">
                <AppLogoIcon className="h-6 w-6" />
                <span className="font-medium">Plant Disease Detection</span>
            </Link>
        </div>
    );
}
