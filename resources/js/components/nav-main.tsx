import { Link } from '@inertiajs/react';
import { useLocation } from '@/hooks/use-location';

export function NavMain() {
    const { currentPath } = useLocation();

    return (
        <div className="grid gap-1">
            <Link
                href="/dashboard"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                    currentPath === '/dashboard'
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
                    <rect width="7" height="9" x="3" y="3" rx="1" />
                    <rect width="7" height="5" x="14" y="3" rx="1" />
                    <rect width="7" height="9" x="14" y="12" rx="1" />
                    <rect width="7" height="5" x="3" y="16" rx="1" />
                </svg>
                Dashboard
            </Link>
            <Link
                href="/history"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                    currentPath === '/history'
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M12 7v5l4 2" />
                </svg>
                Scan History
            </Link>
        </div>
    );
}
