import React, { useState, useEffect } from 'react';
import { XIcon, SparklesIcon, } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { FormField, Select, Textarea, DatePicker } from '../../../components/ui';
import { adminAppointmentsAPI, adminServicesAPI, adminBranchesAPI } from '../../../api/adapters/admin';

interface NewBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface Service {
    id: string;
    name: string;
    price: number;
}

interface Branch {
    id: string;
    name: string;
}

export function NewBookingModal({ isOpen, onClose, onSuccess }: NewBookingModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [formData, setFormData] = useState({
        serviceIds: [] as string[],
        branchId: '',
        appointmentDate: '',
        appointmentTime: '',
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        notes: '',
    });

    // Load services and branches on mount
    useEffect(() => {
        if (isOpen && services.length === 0) {
            loadInitialData();
        }
    }, [isOpen]);

    const loadInitialData = async () => {
        try {
            setLoadingData(true);
            const [servicesRes, branchesRes] = await Promise.all([
                adminServicesAPI.getAll(1, 100),
                adminBranchesAPI.getAll(1, 100),
            ]);
            setServices(servicesRes.data || []);
            setBranches(branchesRes.data || []);
        } catch (error: any) {
            toast.error('Failed to load services and branches');
            console.error(error);
        } finally {
            setLoadingData(false);
        }
    };

    const serviceOptions = services.map(s => ({
        value: s.id,
        label: `${s.name} - ${(s.price / 1000000).toFixed(1)}M VND`
    }));

    const branchOptions = branches.map(b => ({
        value: b.id,
        label: b.name
    }));

    const timeOptions = [
        { value: '08:00', label: '08:00' },
        { value: '09:00', label: '09:00' },
        { value: '10:00', label: '10:00' },
        { value: '14:00', label: '14:00' },
        { value: '15:00', label: '15:00' },
        { value: '16:00', label: '16:00' },
        { value: '16:30', label: '16:30' },
    ];

    const handleServiceChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            serviceIds: [value],
        }));
    };

    const handleSelectChange = (name: string) => (value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: Date | null) => {
        const dateString = date?.toISOString().split('T')[0] || '';
        setFormData((prev) => ({ 
            ...prev, 
            appointmentDate: dateString
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    if (!isOpen) return null;

    const handleSubmit = async () => {
        // Validation
        if (
            !formData.serviceIds.length ||
            !formData.branchId ||
            !formData.appointmentDate ||
            !formData.appointmentTime ||
            !formData.guestName ||
            !formData.guestEmail ||
            !formData.guestPhone
        ) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            const createData: any = {
                serviceIds: formData.serviceIds,
                branchId: formData.branchId,
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.appointmentTime,
                guestName: formData.guestName,
                guestEmail: formData.guestEmail,
                guestPhone: formData.guestPhone,
            };
            if (formData.notes) {
                createData.notes = formData.notes;
            }
            await adminAppointmentsAPI.create(createData);

            toast.success('Appointment created successfully!');
            onSuccess();
            onClose();
            setStep(1);
            setFormData({
                serviceIds: [],
                branchId: '',
                appointmentDate: '',
                appointmentTime: '',
                guestName: '',
                guestEmail: '',
                guestPhone: '',
                notes: '',
            });
        } catch (error: any) {
            toast.error(error.message || 'Failed to create appointment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in'>
            <div className='bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4'>
                <div className='bg-gradient-to-r from-pink-400 to-purple-400 p-6 rounded-t-3xl flex items-center justify-between flex-shrink-0'>
                    <div>
                        <h2 className='text-xl font-bold text-white'>New Booking</h2>
                        <p className='text-white/80 text-sm'>Step {step} of 2</p>
                    </div>
                    <button onClick={onClose} className='p-1 hover:bg-white/20 rounded-full transition-colors'>
                        <XIcon className='w-6 h-6 text-white' />
                    </button>
                </div>
                <div className='p-6 overflow-y-auto flex-1'>
                    <div className='flex items-center justify-between mb-6'>
                        {[1, 2].map((s) => (
                            <div key={s} className='flex items-center flex-1'>
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                                        step >= s
                                            ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
                                            : 'bg-gray-200 text-gray-400'
                                    }`}
                                >
                                    {s}
                                </div>
                                {s < 2 && (
                                    <div
                                        className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                                            step > s ? 'bg-gradient-to-r from-pink-400 to-purple-400' : 'bg-gray-200'
                                        }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    {step === 1 && (
                        <div className='space-y-4 animate-in fade-in slide-in-from-right-2'>
                            {loadingData ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                                </div>
                            ) : (
                                <>
                                    <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100'>
                                        <div className='flex items-center gap-2'>
                                            <SparklesIcon className='w-5 h-5 text-purple-600' />
                                            <button className='text-sm text-purple-600 hover:text-purple-700 font-medium'>
                                                AI: Gợi ý khung giờ tốt nhất
                                            </button>
                                        </div>
                                    </div>

                                    <FormField label='Dịch vụ' name='service' required>
                                        <Select
                                            name='service'
                                            value={formData.serviceIds[0] || ''}
                                            onChange={handleServiceChange}
                                            options={[{ value: '', label: 'Chọn dịch vụ' }, ...serviceOptions]}
                                            placeholder='Chọn dịch vụ'
                                        />
                                    </FormField>

                                    <FormField label='Chi nhánh' name='branchId' required>
                                        <Select
                                            name='branchId'
                                            value={formData.branchId}
                                            onChange={handleSelectChange('branchId')}
                                            options={[{ value: '', label: 'Chọn chi nhánh' }, ...branchOptions]}
                                            placeholder='Chọn chi nhánh'
                                        />
                                    </FormField>

                                    <div className='grid grid-cols-2 gap-4'>
                                        <FormField label='Ngày' name='appointmentDate' required>
                                            <DatePicker
                                                name='appointmentDate'
                                                value={formData.appointmentDate ? new Date(formData.appointmentDate) : null}
                                                onChange={handleDateChange}
                                                placeholder='Chọn ngày'
                                                disablePastDates
                                            />
                                        </FormField>

                                        <FormField label='Giờ' name='appointmentTime' required>
                                            <Select
                                                name='appointmentTime'
                                                value={formData.appointmentTime}
                                                onChange={handleSelectChange('appointmentTime')}
                                                options={[{ value: '', label: 'Chọn giờ' }, ...timeOptions]}
                                            />
                                        </FormField>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    {step === 2 && (
                        <div className='space-y-4 animate-in fade-in slide-in-from-right-2'>
                            <FormField label='Tên khách hàng' name='guestName' required>
                                <input
                                    type='text'
                                    name='guestName'
                                    value={formData.guestName}
                                    onChange={handleChange}
                                    placeholder='Nhập tên khách hàng'
                                    className='w-full px-4 py-2 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm'
                                />
                            </FormField>

                            <FormField label='Email' name='guestEmail' required>
                                <input
                                    type='email'
                                    name='guestEmail'
                                    value={formData.guestEmail}
                                    onChange={handleChange}
                                    placeholder='Nhập email'
                                    className='w-full px-4 py-2 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm'
                                />
                            </FormField>

                            <FormField label='Số điện thoại' name='guestPhone' required>
                                <input
                                    type='tel'
                                    name='guestPhone'
                                    value={formData.guestPhone}
                                    onChange={handleChange}
                                    placeholder='Nhập số điện thoại'
                                    className='w-full px-4 py-2 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm'
                                />
                            </FormField>

                            <FormField label='Ghi chú đặc biệt' name='notes'>
                                <Textarea
                                    name='notes'
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder='Yêu cầu hoặc ghi chú đặc biệt...'
                                    rows={3}
                                    maxLength={300}
                                />
                            </FormField>

                            <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100'>
                                <h4 className='font-semibold text-gray-800 mb-2'>Tóm tắt đặt lịch</h4>
                                <div className='space-y-1 text-sm text-gray-700'>
                                    <p>Dịch vụ: {serviceOptions.find(s => s.value === formData.serviceIds[0])?.label || 'N/A'}</p>
                                    <p>Địa điểm: {branchOptions.find(b => b.value === formData.branchId)?.label || 'N/A'}</p>
                                    <p>Ngày giờ: {formData.appointmentDate} lúc {formData.appointmentTime}</p>
                                    <p className='font-semibold text-gray-800 pt-2 border-t border-pink-100'>
                                        Khách: {formData.guestName || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className='flex-shrink-0 bg-white/90 backdrop-blur-xl p-6 border-t border-pink-100 rounded-b-3xl flex gap-3'>
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            disabled={loading}
                            className='flex-1 px-4 py-3 rounded-lg border border-pink-200 text-gray-700 hover:bg-pink-50 disabled:opacity-50 transition-colors font-medium'
                        >
                            Back
                        </button>
                    )}
                    {step < 2 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            disabled={!formData.serviceIds.length || !formData.branchId || !formData.appointmentDate || !formData.appointmentTime}
                            className='flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 transition-all shadow-sm font-medium'
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className='flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 transition-all shadow-sm font-medium'
                        >
                            {loading ? 'Creating...' : 'Confirm Booking'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
