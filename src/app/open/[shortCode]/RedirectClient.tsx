'use client';

import { useEffect } from 'react';
import { api } from '@/lib/api';

interface RedirectClientProps {
    code: string;
    destination: string;
    customRef?: string;
}

export default function RedirectClient({ code, destination, customRef }: RedirectClientProps) {
    useEffect(() => {
        const performRedirect = async () => {
            try {
                // Attempt to track the visit
                await api.links.trackVisit(code, customRef);
            } catch (e) {
                console.error("Tracking failed", e);
            }

            window.location.replace(destination);
        };
        performRedirect();
    }, [code, destination, customRef]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-xl font-semibold mb-2">Redirecting...</h1>
            <p className="text-muted-foreground break-all">
                You are being redirected to {destination}
            </p>
        </div>
    );
}
