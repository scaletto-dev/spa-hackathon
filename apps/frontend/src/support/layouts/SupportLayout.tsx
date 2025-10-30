import { Outlet } from 'react-router-dom';
import { SocketProvider } from '../../contexts/SocketContext';

/**
 * Support Dashboard Layout
 * Full-screen layout for support staff
 * No shared navbar/footer - completely isolated from client/admin
 */
function SupportLayout() {
    return (
        <SocketProvider>
            <div className='h-screen w-screen overflow-hidden bg-gradient-to-br from-pink-50 via-white to-lavender-50'>
                <Outlet />
            </div>
        </SocketProvider>
    );
}

export default SupportLayout;
