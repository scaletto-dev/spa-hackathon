import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { AIAssistant } from '../components/AIAssistant';

export function AdminLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen w-full bg-gradient-to-br from-pink-50 via-white to-purple-50">
            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Mobile Sidebar - Slide in overlay */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    {/* Mobile Menu */}
                    <div className="fixed inset-y-0 left-0 z-50 lg:hidden animate-in slide-in-from-left duration-300">
                        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
                    </div>
                </>
            )}

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
            <AIAssistant />
        </div>
    );
}
