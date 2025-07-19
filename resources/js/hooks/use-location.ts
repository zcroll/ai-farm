import { usePage } from '@inertiajs/react';

export function useLocation() {
    const page = usePage();
    const currentPath = page.url;
    
    return {
        currentPath,
    };
} 