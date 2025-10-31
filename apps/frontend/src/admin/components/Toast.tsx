import { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, AlertTriangleIcon, XIcon } from 'lucide-react';
interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'warning';
    onClose: () => void;
}
export function Toast({ message, type, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);
    const icons = {
        success: CheckCircleIcon,
        error: XCircleIcon,
        warning: AlertTriangleIcon,
    };
    const colors = {
        success: 'from-green-400 to-emerald-400',
        error: 'from-red-400 to-rose-400',
        warning: 'from-orange-400 to-amber-400',
    };
    const Icon = icons[type];
    return (
        <div className="fixed top-4 right-4 z-[60] animate-in slide-in-from-top-2 fade-in">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-pink-100 p-4 flex items-center gap-3 min-w-[300px]">
                <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-r ${colors[type]} flex items-center justify-center flex-shrink-0`}
                >
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-gray-800 flex-1">{message}</p>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-pink-50 rounded-full transition-colors"
                >
                    <XIcon className="w-4 h-4 text-gray-400" />
                </button>
            </div>
        </div>
    );
}
