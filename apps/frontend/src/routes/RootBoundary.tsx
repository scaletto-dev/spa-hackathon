import { Component, ReactNode } from 'react';

/**
 * Pending/Loading Fallback
 * Displayed while lazy-loaded routes are loading
 */
export function Pending() {
    return (
        <div
            role='status'
            aria-busy='true'
            className='flex items-center justify-center min-h-screen'
        >
            <div className='text-center'>
                <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500'></div>
                <p className='mt-4 text-gray-600'>Loading...</p>
            </div>
        </div>
    );
}

/**
 * Root Error Boundary
 * Catches errors in route components and displays friendly error UI
 */
interface ErrorBoundaryState {
    error?: Error | undefined;
}

export class RootErrorBoundary extends Component<
    { children?: ReactNode },
    ErrorBoundaryState
> {
    state: ErrorBoundaryState = { error: undefined };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // TODO: Log to error reporting service (e.g., Sentry, LogRocket)
        console.error('Route Error Boundary caught error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ error: undefined });
        window.location.reload();
    };

    render() {
        if (this.state.error) {
            return (
                <div
                    role='alert'
                    className='flex items-center justify-center min-h-screen bg-gray-50'
                >
                    <div className='text-center max-w-md p-8 bg-white rounded-lg shadow-lg'>
                        <div className='text-6xl mb-4'>⚠️</div>
                        <h1 className='text-2xl font-bold text-gray-800 mb-2'>
                            Something went wrong
                        </h1>
                        <p className='text-gray-600 mb-4'>
                            We're sorry for the inconvenience. Please try again.
                        </p>
                        <details className='mb-4 text-left'>
                            <summary className='cursor-pointer text-sm text-gray-500 hover:text-gray-700'>
                                Error details
                            </summary>
                            <pre className='mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto'>
                                {this.state.error.message}
                            </pre>
                        </details>
                        <button
                            onClick={this.handleReset}
                            className='px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors'
                        >
                            Try again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
