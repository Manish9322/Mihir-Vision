
'use client';
import { useEffect, useRef } from 'react';

export function useTracking(pageName: string) {
    const visitIdRef = useRef<string | null>(null);

    useEffect(() => {
        const startTracking = async () => {
            try {
                const response = await fetch('/api/track/start', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ page: pageName }),
                });
                if (response.ok) {
                    const data = await response.json();
                    visitIdRef.current = data.visitId;
                }
            } catch (error) {
                console.error('Failed to start tracking:', error);
            }
        };

        startTracking();

        const endTracking = async () => {
            if (visitIdRef.current) {
                // Use navigator.sendBeacon if available for reliability on page unload
                if (navigator.sendBeacon) {
                    const blob = new Blob([JSON.stringify({ visitId: visitIdRef.current })], { type: 'application/json' });
                    navigator.sendBeacon('/api/track/end', blob);
                } else {
                    // Fallback to fetch for older browsers
                    try {
                        await fetch('/api/track/end', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ visitId: visitIdRef.current }),
                            keepalive: true, // Important for requests during unload
                        });
                    } catch (error) {
                        console.error('Failed to end tracking:', error);
                    }
                }
            }
        };
        
        // Track when the user switches tabs
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                endTracking();
            } else if (document.visibilityState === 'visible') {
                startTracking();
            }
        };

        window.addEventListener('beforeunload', endTracking);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            endTracking();
            window.removeEventListener('beforeunload', endTracking);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [pageName]);
}
