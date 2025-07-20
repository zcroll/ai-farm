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
                href="/disease-library"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                    currentPath === '/disease-library'
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
                    <path d="M4 17V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12" />
                    <rect width="16" height="6" x="4" y="17" rx="2" />
                </svg>
                Disease Library
            </Link>
            <Link
                href="/community"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                    currentPath === '/community'
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Community
            </Link>
        </div>
    );
}
