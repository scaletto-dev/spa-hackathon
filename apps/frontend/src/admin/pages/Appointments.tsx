import { useState } from 'react';
import { CalendarIcon, ClockIcon, UserIcon, MapPinIcon, CheckCircleIcon, XCircleIcon, Edit3Icon } from 'lucide-react';
import { NewBookingModal } from '../components/modals/NewBookingModal';
import { Toast } from '../components/Toast';
import { useAppointments } from '../../hooks/useStore';
import { toast as toastUtil } from '../../utils/toast';
import { useTranslation } from 'react-i18next';

export function Appointments() {
    const { t } = useTranslation('common');
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
            message: t('admin.appointments.bookingCreated'),
            type: 'success',
        });
        toastUtil.success(t('admin.appointments.appointmentAdded'));
    };

    const handleDeleteAppointment = (id: number, clientName: string) => {
        if (confirm(t('admin.appointments.confirmCancel', { clientName }))) {
            deleteAppointment(id);
            toastUtil.success(t('admin.appointments.cancelled'));
        }
    };

    const handleStatusToggle = (id: number, currentStatus: string) => {
        const newStatus = currentStatus === 'confirmed' ? 'pending' : 'confirmed';
        updateAppointment(id, { status: newStatus as 'confirmed' | 'pending' });
        toastUtil.success(t('admin.appointments.statusUpdated', { status: newStatus }));
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
                    <h1 className='text-3xl font-bold text-gray-800'>{t('admin.appointments.title')}</h1>
                    <p className='text-gray-600 mt-1'>{t('admin.appointments.subtitle')}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className='px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm'
                >
                    {t('admin.appointments.newBooking')}
                </button>
            </div>
            <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100'>
                <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center'>
                        <CalendarIcon className='w-4 h-4 text-white' />
                    </div>
                    <p className='text-sm text-gray-700'>
                        <span className='font-semibold'>{t('admin.appointments.aiPrediction')}:</span>{' '}
                        {t('admin.appointments.aiPredictionText')}
                    </p>
                </div>
            </div>
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm overflow-hidden'>
                <div className='p-4 border-b border-pink-100 flex items-center gap-4'>
                    <input
                        type='text'
                        placeholder={t('admin.appointments.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='flex-1 px-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm'
                    />
                    <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className='px-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm'
                    >
                        <option>{t('admin.appointments.allBranches')}</option>
                        <option>Downtown Clinic</option>
                        <option>Westside Center</option>
                    </select>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className='px-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm'
                    >
                        <option>{t('admin.appointments.allStatus')}</option>
                        <option>{t('admin.appointments.statusConfirmed')}</option>
                        <option>{t('admin.appointments.statusPending')}</option>
                        <option>{t('admin.appointments.statusCompleted')}</option>
                    </select>
                </div>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-pink-50/50'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    {t('admin.appointments.client')}
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    {t('admin.appointments.service')}
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    {t('admin.appointments.therapist')}
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    {t('admin.appointments.branch')}
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    {t('admin.appointments.dateTime')}
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    {t('admin.appointments.status')}
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    {t('admin.appointments.actions')}
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
                                                onClick={() => toastUtil.info(t('admin.appointments.editComingSoon'))}
                                                className='p-2 rounded-lg hover:bg-pink-100 transition-colors'
                                                aria-label={t('common.edit')}
                                            >
                                                <Edit3Icon className='w-4 h-4 text-gray-600' />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteAppointment(appointment.id, appointment.customerName)
                                                }
                                                className='p-2 rounded-lg hover:bg-red-100 transition-colors'
                                                aria-label={t('common.delete')}
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
