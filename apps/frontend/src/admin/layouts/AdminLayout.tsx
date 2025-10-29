import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { AIAssistant } from '../components/AIAssistant';

export function AdminLayout() {
    return (
        <div className='flex h-screen w-full bg-gradient-to-br from-pink-50 via-white to-purple-50'>
            <Sidebar />
            <div className='flex-1 flex flex-col overflow-hidden'>
                <Header />
                <main className='flex-1 overflow-y-auto p-6'>
                    <Outlet />
                </main>
            </div>
            <AIAssistant />
        </div>
    );
}
