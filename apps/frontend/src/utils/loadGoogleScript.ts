/**
 * Google Identity Services Script Loader
 *
 * Loads the GIS script idempotently (safe to call multiple times).
 * Ensures only one script tag is added and all concurrent calls
 * wait for the same loading promise.
 *
 * @returns Promise that resolves when script is loaded
 */

// Global state to track script loading
let scriptLoaded = false;
let scriptLoading = false;
const loadPromises: Promise<void>[] = [];

export function loadGoogleScript(): Promise<void> {
    // Already loaded - return immediately
    if (scriptLoaded) {
        return Promise.resolve();
    }

    // Currently loading - return existing promise
    if (scriptLoading && loadPromises.length > 0) {
        const existingPromise = loadPromises[0];
        if (existingPromise) {
            return existingPromise;
        }
    }

    // Start loading
    scriptLoading = true;

    const promise = new Promise<void>((resolve, reject) => {
        // Check if Google script already exists in window
        if (window.google?.accounts?.id) {
            scriptLoaded = true;
            scriptLoading = false;
            resolve();
            return;
        }

        // Create script element
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;

        script.onload = () => {
            scriptLoaded = true;
            scriptLoading = false;
            resolve();
        };

        script.onerror = () => {
            scriptLoading = false;
            reject(new Error('Failed to load Google Identity Services script'));
        };

        // Append to document head
        document.head.appendChild(script);
    });

    loadPromises.push(promise);
    return promise;
}

/**
 * Reset loader state (for testing)
 */
export function resetGoogleScriptLoader(): void {
    scriptLoaded = false;
    scriptLoading = false;
    loadPromises.length = 0;
}
