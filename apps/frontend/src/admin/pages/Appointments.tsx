import { useState } from 'react';
import { CalendarIcon, ClockIcon, UserIcon, MapPinIcon, CheckCircleIcon, XCircleIcon, Edit3Icon } from 'lucide-react';
import { NewBookingModal } from '../components/modals/NewBookingModal';
import { Toast } from '../components/Toast';
import { useAppointments } from '../../hooks/useStore';
import { toast as toastUtil } from '../../utils/toast';

export function Appointments() {
    const { appointments, deleteAppointment, updateAppointment } = useAppointments();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('All Branches');
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning';
    } | null>(null);

    const handleBookingSuccess = () => {
        setToast({
            message: 'Booking created successfully!',
            type: 'success',
        });
        toastUtil.success('New appointment added successfully!');
    };

    const handleDeleteAppointment = (id: number, clientName: string) => {
        if (confirm(`Are you sure you want to cancel appointment for ${clientName}?`)) {
            deleteAppointment(id);
            toastUtil.success('Appointment cancelled successfully');
        }
    };

    const handleStatusToggle = (id: number, currentStatus: string) => {
        const newStatus = currentStatus === 'confirmed' ? 'pending' : 'confirmed';
        updateAppointment(id, { status: newStatus as 'confirmed' | 'pending' });
        toastUtil.success(`Appointment status updated to ${newStatus}`);
    };

    // Filter appointments
    const filteredAppointments = appointments.filter((apt) => {
        const matchesSearch =
            apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            apt.service.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBranch = selectedBranch === 'All Branches' || apt.branch === selectedBranch;
        const matchesStatus = selectedStatus === 'All Status' || apt.status === selectedStatus.toLowerCase();
        return matchesSearch && matchesBranch && matchesStatus;
    });

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-800'>Appointments</h1>
                    <p className='text-gray-600 mt-1'>Manage all clinic bookings</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className='px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm'
                >
                    New Booking
                </button>
            </div>
            <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100'>
                <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center'>
                        <CalendarIcon className='w-4 h-4 text-white' />
                    </div>
                    <p className='text-sm text-gray-700'>
                        <span className='font-semibold'>AI Prediction:</span> High demand expected between 3-5 PM today.
                        Consider adjusting staff schedules.
                    </p>
                </div>
            </div>
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm overflow-hidden'>
                <div className='p-4 border-b border-pink-100 flex items-center gap-4'>
                    <input
                        type='text'
                        placeholder='Search appointments...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='flex-1 px-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm'
                    />
                    <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className='px-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm'
                    >
                        <option>All Branches</option>
                        <option>Downtown Clinic</option>
                        <option>Westside Center</option>
                    </select>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className='px-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm'
                    >
                        <option>All Status</option>
                        <option>Confirmed</option>
                        <option>Pending</option>
                        <option>Completed</option>
                    </select>
                </div>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-pink-50/50'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Client
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Service
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Therapist
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Branch
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Date & Time
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Status
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-pink-100'>
                            {filteredAppointments.map((appointment) => (
                                <tr key={appointment.id} className='hover:bg-pink-50/30 transition-colors'>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-semibold'>
                                                {appointment.customerName.charAt(0)}
                                            </div>
                                            <span className='font-medium text-gray-800'>
                                                {appointment.customerName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <span className='text-sm text-gray-700'>{appointment.service}</span>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-2'>
                                            <UserIcon className='w-4 h-4 text-gray-400' />
                                            <span className='text-sm text-gray-700'>{appointment.therapist}</span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-2'>
                                            <MapPinIcon className='w-4 h-4 text-gray-400' />
                                            <span className='text-sm text-gray-700'>{appointment.branch}</span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-2'>
                                            <ClockIcon className='w-4 h-4 text-gray-400' />
                                            <div>
                                                <div className='text-sm font-medium text-gray-800'>
                                                    {appointment.date}
                                                </div>
                                                <div className='text-xs text-gray-500'>{appointment.time}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <button
                                            onClick={() => handleStatusToggle(appointment.id, appointment.status)}
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                                                appointment.status === 'confirmed'
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                            }`}
                                        >
                                            {appointment.status === 'confirmed' ? (
                                                <CheckCircleIcon className='w-3 h-3 mr-1' />
                                            ) : (
                                                <ClockIcon className='w-3 h-3 mr-1' />
                                            )}
                                            {appointment.status}
                                        </button>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-2'>
                                            <button
                                                onClick={() => toastUtil.info('Edit feature coming soon...')}
                                                className='p-2 rounded-lg hover:bg-pink-100 transition-colors'
                                            >
                                                <Edit3Icon className='w-4 h-4 text-gray-600' />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteAppointment(appointment.id, appointment.customerName)
                                                }
                                                className='p-2 rounded-lg hover:bg-red-100 transition-colors'
                                            >
                                                <XCircleIcon className='w-4 h-4 text-red-500' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <NewBookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleBookingSuccess}
            />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}

export default Appointments;
