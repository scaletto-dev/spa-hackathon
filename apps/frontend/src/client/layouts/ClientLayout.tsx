import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layouts/Navbar';
import { Footer } from '../components/layouts/Footer';
import { ChatWidgetProvider } from '../../contexts/ChatWidgetContext';
import { GlobalChatWidget } from '../components/GlobalChatWidget';

export function ClientLayout() {
    return (
        <ChatWidgetProvider>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                    <Outlet />
                </main>
                <Footer />
                <GlobalChatWidget />
            </div>
        </ChatWidgetProvider>
    );
}
