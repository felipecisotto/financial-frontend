import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function PWAProvider({ children }: { children: React.ReactNode }) {
    const [needRefresh, setNeedRefresh] = useState(false);
    const [offlineReady, setOfflineReady] = useState(false);

    useEffect(() => {
        const { updateServiceWorker } = registerSW({
            onNeedRefresh() {
                setNeedRefresh(true);
            },
            onOfflineReady() {
                setOfflineReady(true);
            },
        });

        // Auto update when new version is available
        if (needRefresh) {
            updateServiceWorker(true);
        }
    }, [needRefresh]);

    return (
        <>
            {children}
            {(needRefresh || offlineReady) && (
                <div className="fixed bottom-0 right-0 m-4 p-4 bg-white rounded-lg shadow-lg">
                    {needRefresh && (
                        <div className="flex items-center gap-2">
                            <span>New content available, click on reload button to update.</span>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Reload
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
} 