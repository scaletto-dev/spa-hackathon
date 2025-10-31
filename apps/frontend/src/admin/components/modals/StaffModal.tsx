import React, { useState } from 'react';
import { XIcon, UploadIcon, SparklesIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormField, Input, Select, Textarea } from '../../../components/ui';
import { toast } from '../../../utils/toast';

interface StaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function StaffModal({ isOpen, onClose, onSuccess }: StaffModalProps) {
    const { t } = useTranslation('common');
    const [formData, setFormData] = useState({
        name: '',
        specialization: '',
        branch: '',
        startTime: '',
        endTime: '',
        bio: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string) => (value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenerateAIBio = () => {
        const bios = [
            `Chuyên viên có hơn 5 năm kinh nghiệm trong lĩnh vực ${
                formData.specialization || 'làm đẹp'
            }. Tốt nghiệp từ Học viện Thẩm mỹ Quốc tế với bằng Distinction. Luôn cập nhật xu hướng và kỹ thuật mới nhất để mang đến trải nghiệm tốt nhất cho khách hàng.`,
            `Với đam mê và tận tâm, đã phục vụ hàng nghìn khách hàng hài lòng. Chứng chỉ chuyên môn từ các tổ chức uy tín quốc tế. Phong cách phục vụ chuyên nghiệp, tư vấn tận tình và hiệu quả cao.`,
            `Chuyên gia ${
                formData.specialization || 'làm đẹp'
            } với portfolio ấn tượng. Từng đào tạo tại Hàn Quốc và Nhật Bản. Kỹ năng giao tiếp tốt, thấu hiểu nhu cầu khách hàng, mang đến dịch vụ đẳng cấp 5 sao.`,
        ];
        const randomIndex = Math.floor(Math.random() * bios.length);
        const randomBio = bios[randomIndex] ?? bios[0] ?? '';
        setFormData((prev) => ({ ...prev, bio: randomBio }));
        toast.info('Đã tạo tiểu sử bằng AI');
    };

    const handleSubmit = () => {
        // Validation
        if (!formData.name.trim()) {
            toast.error(t('admin.staff.enterName'));
            return;
        }
        if (!formData.specialization) {
            toast.error(t('admin.staff.selectSpecialization'));
            return;
        }
        if (!formData.branch) {
            toast.error(t('admin.staff.selectBranch'));
            return;
        }
        if (!formData.startTime || !formData.endTime) {
            toast.error(t('admin.staff.enterWorkingHours'));
            return;
        }

        // Validate time range
        if (formData.startTime >= formData.endTime) {
            toast.error(t('admin.staff.endTimeAfterStart'));
            return;
        }

        // Mock: Simulate staff creation
        const newStaff = {
            id: Date.now().toString(),
            ...formData,
            rating: 5.0,
            totalAppointments: 0,
            status: 'active',
            joinedDate: new Date().toISOString(),
        };

        console.log('👤 Mock: Created staff member:', newStaff);
        toast.success(`Đã thêm chuyên viên "${formData.name}" thành công! (Mocked)`);

        // Reset form
        setFormData({
            name: '',
            specialization: '',
            branch: '',
            startTime: '',
            endTime: '',
            bio: '',
        });

        onSuccess?.();
        onClose();
    };

    const specializationOptions = [
        { value: '', label: 'Chọn chuyên môn' },
        { value: 'facial', label: 'Chuyên viên chăm sóc da' },
        { value: 'massage', label: 'Chuyên viên massage' },
        { value: 'hair', label: 'Chuyên viên tóc' },
        { value: 'nail', label: 'Chuyên viên nail' },
    ];

    const branchOptions = [
        { value: '', label: 'Chọn chi nhánh' },
        { value: 'downtown', label: 'Chi nhánh Trung tâm' },
        { value: 'westside', label: 'Chi nhánh Tây' },
        { value: 'eastside', label: 'Chi nhánh Đông' },
    ];

    if (!isOpen) return null;
    return (
        <>
            <div className='!fixed !inset-0 !m-0 !p-0 bg-black/50 backdrop-blur-sm z-[9999]' onClick={onClose} />
            <div className='!fixed !inset-0 !m-0 !p-0 flex items-center justify-center z-[10000] pointer-events-none'>
                <div className='bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 max-h-[90vh] overflow-y-auto pointer-events-auto'>
                    <div className='bg-gradient-to-r from-pink-400 to-purple-400 p-6 rounded-t-3xl flex items-center justify-between sticky top-0'>
                        <h2 className='text-xl font-bold text-white'>Thêm Chuyên viên mới</h2>
                        <button onClick={onClose} className='p-1 hover:bg-white/20 rounded-full transition-colors'>
                            <XIcon className='w-6 h-6 text-white' />
                        </button>
                    </div>
                    <div className='p-6 space-y-4'>
                        <div className='flex justify-center'>
                            <div className='relative'>
                                <div className='w-32 h-32 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center border-4 border-white shadow-lg'>
                                    <UploadIcon className='w-8 h-8 text-gray-400' />
                                </div>
                                <button className='absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center shadow-lg'>
                                    <UploadIcon className='w-5 h-5 text-white' />
                                </button>
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <FormField label='Họ và tên' name='name' required>
                                <Input
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder='Nhập họ và tên'
                                />
                            </FormField>

                            <FormField label='Chuyên môn' name='specialization' required>
                                <Select
                                    name='specialization'
                                    value={formData.specialization}
                                    onChange={handleSelectChange('specialization')}
                                    options={specializationOptions}
                                    placeholder='Chọn chuyên môn'
                                />
                            </FormField>
                        </div>

                        <FormField label='Chi nhánh' name='branch' required>
                            <Select
                                name='branch'
                                value={formData.branch}
                                onChange={handleSelectChange('branch')}
                                options={branchOptions}
                                placeholder='Chọn chi nhánh'
                            />
                        </FormField>

                        <FormField label='Giờ làm việc' name='workingHours' required>
                            <div className='grid grid-cols-2 gap-4'>
                                <Input
                                    type='time'
                                    name='startTime'
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    placeholder='Giờ bắt đầu'
                                />
                                <Input
                                    type='time'
                                    name='endTime'
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    placeholder='Giờ kết thúc'
                                />
                            </div>
                        </FormField>

                        <div>
                            <div className='flex items-center justify-between mb-2'>
                                <label className='block text-sm font-medium text-gray-700'>Tiểu sử</label>
                                <button
                                    type='button'
                                    onClick={handleGenerateAIBio}
                                    className='text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1'
                                >
                                    <SparklesIcon className='w-3 h-3' />
                                    Tạo bằng AI
                                </button>
                            </div>
                            <FormField name='bio'>
                                <Textarea
                                    name='bio'
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder='Tiểu sử và trình độ chuyên môn...'
                                    rows={4}
                                    maxLength={500}
                                    showCounter
                                />
                            </FormField>
                        </div>

                        <div className='flex gap-3 pt-4'>
                            <button
                                onClick={onClose}
                                className='flex-1 px-4 py-2 rounded-lg border border-pink-200 text-gray-700 hover:bg-pink-50 transition-colors'
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSubmit}
                                className='flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm'
                            >
                                Thêm Chuyên viên
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
