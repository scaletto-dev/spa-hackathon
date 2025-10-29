import React, { useState } from 'react';
import { UserIcon, PlusIcon, Edit3Icon, CalendarIcon, XCircleIcon, SparklesIcon } from 'lucide-react';
import { StaffModal } from '../components/modals/StaffModal';
import { Toast } from '../components/Toast';
const staff = [
    {
        id: 1,
        name: 'Emma Wilson',
        specialization: 'Facial Specialist',
        branch: 'Downtown Spa',
        rating: 4.9,
        status: 'available',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    },
    {
        id: 2,
        name: 'Lisa Anderson',
        specialization: 'Massage Therapist',
        branch: 'Westside Clinic',
        rating: 4.8,
        status: 'available',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    },
    {
        id: 3,
        name: 'Sophie Martinez',
        specialization: 'Hair Stylist',
        branch: 'Downtown Spa',
        rating: 4.7,
        status: 'on-leave',
        avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop',
    },
    {
        id: 4,
        name: 'Rachel Kim',
        specialization: 'Nail Technician',
        branch: 'Eastside Beauty',
        rating: 4.9,
        status: 'available',
        avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&h=200&fit=crop',
    },
];
export function Staff() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning';
    } | null>(null);
    const handleStaffAdded = () => {
        setToast({
            message: 'Therapist added successfully!',
            type: 'success',
        });
    };

    const handleEditStaff = (staffId: number, name: string) => {
        console.log(`✏️ Mock: Editing staff #${staffId}`);
        setToast({
            message: `Chức năng chỉnh sửa "${name}" đang được phát triển...`,
            type: 'warning',
        });
    };

    const handleViewSchedule = (staffId: number, name: string) => {
        console.log(`📅 Mock: Viewing schedule for staff #${staffId}`);
        setToast({
            message: `Đang xem lịch của "${name}"... (Mocked)`,
            type: 'success',
        });
    };

    const handleDeleteStaff = (staffId: number, name: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa chuyên viên "${name}"?`)) {
            console.log(`🗑️ Mock: Deleted staff #${staffId}`);
            setToast({
                message: `Đã xóa chuyên viên "${name}"! (Mocked)`,
                type: 'success',
            });
        }
    };
    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-800'>Staff & Therapists</h1>
                    <p className='text-gray-600 mt-1'>Manage your team members</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className='px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm flex items-center gap-2'
                >
                    <PlusIcon className='w-5 h-5' />
                    Add New Therapist
                </button>
            </div>
            <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100'>
                <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center'>
                        <SparklesIcon className='w-4 h-4 text-white' />
                    </div>
                    <p className='text-sm text-gray-700'>
                        <span className='font-semibold'>AI Tip:</span> Click "Generate Bio" when adding a therapist to
                        automatically create a professional description
                    </p>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {staff.map((member) => (
                    <div
                        key={member.id}
                        className='bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-lg transition-all'
                    >
                        <div className='relative'>
                            <img src={member.avatar} alt={member.name} className='w-full h-48 object-cover' />
                            <div className='absolute top-3 right-3'>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        member.status === 'available'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-orange-500 text-white'
                                    }`}
                                >
                                    {member.status === 'available' ? 'Available' : 'On Leave'}
                                </span>
                            </div>
                            <div className='absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1'>
                                <span className='text-yellow-500'>★</span>
                                <span className='text-sm font-semibold text-gray-800'>{member.rating}</span>
                            </div>
                        </div>
                        <div className='p-5'>
                            <h3 className='text-lg font-semibold text-gray-800 mb-1'>{member.name}</h3>
                            <p className='text-sm text-purple-600 mb-2'>{member.specialization}</p>
                            <p className='text-xs text-gray-500 mb-4'>{member.branch}</p>
                            <div className='flex gap-2'>
                                <button
                                    onClick={() => handleEditStaff(member.id, member.name)}
                                    className='flex-1 py-2 bg-pink-50 text-pink-600 rounded-lg text-sm font-medium hover:bg-pink-100 transition-colors flex items-center justify-center gap-1'
                                >
                                    <Edit3Icon className='w-4 h-4' />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleViewSchedule(member.id, member.name)}
                                    className='p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors'
                                >
                                    <CalendarIcon className='w-4 h-4' />
                                </button>
                                <button
                                    onClick={() => handleDeleteStaff(member.id, member.name)}
                                    className='p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors'
                                >
                                    <XCircleIcon className='w-4 h-4' />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <StaffModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleStaffAdded} />
        </div>
    );
}
