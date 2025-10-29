import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FormField,
    Input,
    Textarea,
    Select,
    MultiSelect,
    DatePicker,
    TimePicker,
    Radio,
    Checkbox,
    Toggle,
    SelectOption,
    SelectGroup,
} from '../../components/ui';
import { MailIcon, PhoneIcon, SearchIcon, UserIcon } from 'lucide-react';

export default function FormShowcasePage() {
    // Input states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [budget, setBudget] = useState('');
    const [search, setSearch] = useState('');

    // Textarea state
    const [notes, setNotes] = useState('');

    // Select states
    const [service, setService] = useState('');
    const [branch, setBranch] = useState('');
    const [therapist, setTherapist] = useState('');

    // Multi-select states
    const [skinTypes, setSkinTypes] = useState<string[]>([]);
    const [concerns, setConcerns] = useState<string[]>([]);

    // Date & Time states
    const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
    const [appointmentTime, setAppointmentTime] = useState('');

    // Radio state
    const [gender, setGender] = useState('');

    // Checkbox states
    const [subscribeNews, setSubscribeNews] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);

    // Toggle state
    const [notifications, setNotifications] = useState(false);

    // Form validation errors (demo)
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Options data
    const serviceOptions: SelectOption[] = [
        { value: 'facial', label: 'Chăm sóc da mặt cơ bản' },
        { value: 'hydrafacial', label: 'Hydrafacial Treatment' },
        { value: 'laser', label: 'Laser Hair Removal' },
        { value: 'botox', label: 'Botox & Fillers' },
        { value: 'body', label: 'Body Contouring' },
    ];

    const serviceGroups: SelectGroup[] = [
        {
            label: 'Dịch vụ da mặt',
            options: [
                { value: 'facial-basic', label: 'Chăm sóc da mặt cơ bản' },
                { value: 'facial-advanced', label: 'Chăm sóc da mặt nâng cao' },
                { value: 'hydrafacial', label: 'Hydrafacial Treatment' },
            ],
        },
        {
            label: 'Công nghệ Laser',
            options: [
                { value: 'laser-hair', label: 'Laser Hair Removal' },
                { value: 'laser-skin', label: 'Laser Skin Rejuvenation' },
            ],
        },
        {
            label: 'Dịch vụ Body',
            options: [
                { value: 'body-contour', label: 'Body Contouring' },
                { value: 'cellulite', label: 'Cellulite Reduction' },
            ],
        },
    ];

    const branchOptions: SelectOption[] = [
        { value: 'hcm-center', label: 'TP.HCM - Quận 1' },
        { value: 'hcm-district7', label: 'TP.HCM - Quận 7' },
        { value: 'hanoi-center', label: 'Hà Nội - Hoàn Kiếm' },
        { value: 'hanoi-caugiay', label: 'Hà Nội - Cầu Giấy' },
    ];

    const therapistOptions: SelectOption[] = [
        { value: 'auto', label: 'Tự động chọn chuyên viên phù hợp' },
        { value: 'dr-linh', label: 'BS. Nguyễn Thị Linh' },
        { value: 'dr-minh', label: 'BS. Trần Minh Quân' },
        { value: 'th-hoa', label: 'TH. Lê Thị Hoa' },
    ];

    const skinTypeOptions: SelectOption[] = [
        { value: 'oily', label: 'Da dầu' },
        { value: 'dry', label: 'Da khô' },
        { value: 'combination', label: 'Da hỗn hợp' },
        { value: 'sensitive', label: 'Da nhạy cảm' },
        { value: 'normal', label: 'Da thường' },
    ];

    const concernOptions: SelectOption[] = [
        { value: 'acne', label: 'Mụn' },
        { value: 'dark-spots', label: 'Thâm nám' },
        { value: 'pores', label: 'Lỗ chân lông to' },
        { value: 'aging', label: 'Lão hoá' },
        { value: 'wrinkles', label: 'Nếp nhăn' },
        { value: 'pigmentation', label: 'Sắc tố da' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation
        const newErrors: Record<string, string> = {};
        if (!name) newErrors.name = 'Vui lòng nhập họ tên';
        if (!email) newErrors.email = 'Vui lòng nhập email';
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        if (!phone) newErrors.phone = 'Vui lòng nhập số điện thoại';
        if (!service) newErrors.service = 'Vui lòng chọn dịch vụ';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        alert('Form submitted successfully! (Demo)');
    };

    return (
        <div className='w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-24'>
            <div className='max-w-4xl mx-auto px-6 py-12'>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className='text-center mb-12'
                >
                    <h1 className='text-4xl md:text-5xl font-bold mb-4'>
                        <span className='bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent'>
                            Form Components Showcase
                        </span>
                    </h1>
                    <p className='text-xl text-gray-600'>Design System chuẩn chỉnh, đẹp mắt, dễ dùng, A11y compliant</p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    onSubmit={handleSubmit}
                    className='bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-8 md:p-12 space-y-6'
                >
                    {/* Text Inputs Section */}
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800 mb-6'>Text Inputs</h2>

                        <div className='grid md:grid-cols-2 gap-6'>
                            <FormField
                                label='Họ và tên'
                                name='name'
                                error={errors.name}
                                helpText='Nhập họ tên đầy đủ của bạn'
                                required
                            >
                                <Input
                                    name='name'
                                    type='text'
                                    placeholder='Nguyễn Văn A'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    error={errors.name}
                                    leftIcon={UserIcon}
                                />
                            </FormField>

                            <FormField
                                label='Email liên hệ'
                                name='email'
                                error={errors.email}
                                helpText='Chúng tôi sẽ gửi xác nhận qua email'
                                required
                            >
                                <Input
                                    name='email'
                                    type='email'
                                    placeholder='example@email.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    error={errors.email}
                                    leftIcon={MailIcon}
                                />
                            </FormField>
                        </div>

                        <div className='grid md:grid-cols-2 gap-6'>
                            <FormField
                                label='Số điện thoại'
                                name='phone'
                                error={errors.phone}
                                helpText='Định dạng tự động khi nhập'
                                required
                            >
                                <Input
                                    name='phone'
                                    type='tel'
                                    placeholder='0912 345 678'
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    error={errors.phone}
                                    leftIcon={PhoneIcon}
                                    mask='phone'
                                />
                            </FormField>

                            <FormField label='Ngân sách dự kiến' name='budget' helpText='Tự động định dạng số'>
                                <Input
                                    name='budget'
                                    type='text'
                                    placeholder='5,000,000'
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    mask='number'
                                />
                            </FormField>
                        </div>

                        <FormField label='Tìm kiếm' name='search' helpText='Ví dụ input với icon tìm kiếm'>
                            <Input
                                name='search'
                                type='text'
                                placeholder='Tìm dịch vụ, chuyên viên...'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                leftIcon={SearchIcon}
                            />
                        </FormField>
                    </div>

                    {/* Textarea Section */}
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800 mb-6 mt-12'>Textarea</h2>

                        <FormField
                            label='Ghi chú thêm'
                            name='notes'
                            helpText='Chia sẻ bất kỳ thông tin nào bạn muốn chúng tôi biết'
                        >
                            <Textarea
                                name='notes'
                                placeholder='Tôi muốn tư vấn thêm về...'
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                showCounter
                                maxLength={500}
                                autoResize
                            />
                        </FormField>
                    </div>

                    {/* Select Section */}
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800 mb-6 mt-12'>Select (Single)</h2>

                        <div className='grid md:grid-cols-2 gap-6'>
                            <FormField
                                label='Chọn dịch vụ'
                                name='service'
                                error={errors.service}
                                helpText='Chọn dịch vụ bạn quan tâm'
                                required
                            >
                                <Select
                                    name='service'
                                    value={service}
                                    onChange={setService}
                                    groups={serviceGroups}
                                    placeholder='Chọn dịch vụ...'
                                    error={errors.service}
                                    searchable
                                />
                            </FormField>

                            <FormField label='Chọn cơ sở' name='branch' helpText='Chi nhánh gần bạn nhất'>
                                <Select
                                    name='branch'
                                    value={branch}
                                    onChange={setBranch}
                                    options={branchOptions}
                                    placeholder='Chọn cơ sở...'
                                    searchable
                                />
                            </FormField>
                        </div>

                        <FormField label='Chọn chuyên viên' name='therapist' helpText='Để trống nếu muốn tự động chọn'>
                            <Select
                                name='therapist'
                                value={therapist}
                                onChange={setTherapist}
                                options={therapistOptions}
                                placeholder='Tự động chọn...'
                            />
                        </FormField>
                    </div>

                    {/* Multi-Select Section */}
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800 mb-6 mt-12'>Multi-Select</h2>

                        <div className='grid md:grid-cols-2 gap-6'>
                            <FormField label='Loại da' name='skinType' helpText='Có thể chọn nhiều loại'>
                                <MultiSelect
                                    name='skinType'
                                    value={skinTypes}
                                    onChange={setSkinTypes}
                                    options={skinTypeOptions}
                                    placeholder='Chọn loại da...'
                                    maxSelections={3}
                                />
                            </FormField>

                            <FormField
                                label='Mối quan tâm về da'
                                name='concerns'
                                helpText='Chọn tất cả vấn đề bạn gặp phải'
                            >
                                <MultiSelect
                                    name='concerns'
                                    value={concerns}
                                    onChange={setConcerns}
                                    options={concernOptions}
                                    placeholder='Chọn mối quan tâm...'
                                    searchable
                                />
                            </FormField>
                        </div>
                    </div>

                    {/* Date & Time Section */}
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800 mb-6 mt-12'>Date & Time Pickers</h2>

                        <div className='grid md:grid-cols-2 gap-6'>
                            <FormField label='Chọn ngày' name='date' helpText='Không thể chọn ngày trong quá khứ'>
                                <DatePicker
                                    name='date'
                                    value={appointmentDate}
                                    onChange={setAppointmentDate}
                                    placeholder='dd/mm/yyyy'
                                    disablePastDates
                                    quickPicks
                                />
                            </FormField>

                            <FormField label='Chọn giờ' name='time' helpText='Giờ làm việc: 09:00 - 20:00'>
                                <TimePicker
                                    name='time'
                                    value={appointmentTime}
                                    onChange={setAppointmentTime}
                                    placeholder='Chọn giờ...'
                                    startTime='09:00'
                                    endTime='20:00'
                                    interval={30}
                                    disabledSlots={['12:00', '12:30', '18:00']}
                                />
                            </FormField>
                        </div>
                    </div>

                    {/* Radio & Checkbox Section */}
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800 mb-6 mt-12'>Radio & Checkbox</h2>

                        <FormField label='Giới tính' name='gender' helpText='Chọn một trong các tùy chọn'>
                            <div className='flex flex-wrap gap-4'>
                                <Radio
                                    name='gender'
                                    value='male'
                                    label='Nam'
                                    checked={gender === 'male'}
                                    onChange={(e) => setGender(e.target.value)}
                                />
                                <Radio
                                    name='gender'
                                    value='female'
                                    label='Nữ'
                                    checked={gender === 'female'}
                                    onChange={(e) => setGender(e.target.value)}
                                />
                                <Radio
                                    name='gender'
                                    value='other'
                                    label='Khác'
                                    checked={gender === 'other'}
                                    onChange={(e) => setGender(e.target.value)}
                                />
                            </div>
                        </FormField>

                        <div className='space-y-3'>
                            <Checkbox
                                name='subscribeNews'
                                label='Nhận tin tức và ưu đãi qua email'
                                checked={subscribeNews}
                                onChange={(e) => setSubscribeNews(e.target.checked)}
                            />
                            <Checkbox
                                name='acceptTerms'
                                label='Tôi đồng ý với điều khoản sử dụng'
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                            />
                        </div>
                    </div>

                    {/* Toggle Section */}
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800 mb-6 mt-12'>Toggle Switch</h2>

                        <Toggle
                            name='notifications'
                            label='Nhận nhắc hẹn qua SMS'
                            checked={notifications}
                            onChange={setNotifications}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className='pt-8 border-t border-gray-200'>
                        <motion.button
                            type='submit'
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-shadow'
                        >
                            Đặt lịch ngay
                        </motion.button>
                    </div>
                </motion.form>
            </div>
        </div>
    );
}
