import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Save, Loader2, CheckCircle } from 'lucide-react';
import { getMemberProfile, updateMemberProfile, type MemberProfile } from '../../../api/adapters/member';

export default function ProfileManagement() {
    const [profile, setProfile] = useState<MemberProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [language, setLanguage] = useState<'vi' | 'ja' | 'en' | 'zh'>('vi');

    // Load profile on mount
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getMemberProfile();
            setProfile(data);
            setFullName(data.fullName);
            setPhone(data.phone);
            setLanguage(data.language);
        } catch (err) {
            setError('Không thể tải thông tin cá nhân. Vui lòng thử lại.');
            console.error('Load profile error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim()) {
            setError('Vui lòng nhập họ tên');
            return;
        }

        if (!phone.trim()) {
            setError('Vui lòng nhập số điện thoại');
            return;
        }

        try {
            setIsSaving(true);
            setError(null);

            const updated = await updateMemberProfile({
                fullName: fullName.trim(),
                phone: phone.trim(),
                language,
            });

            setProfile(updated);

            // Show success toast
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            setError('Không thể cập nhật thông tin. Vui lòng thử lại.');
            console.error('Update profile error:', err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-20'>
                <div className='flex items-center justify-center py-20'>
                    <Loader2 className='w-8 h-8 text-pink-500 animate-spin' />
                    <span className='ml-3 text-gray-600'>Đang tải thông tin...</span>
                </div>
            </div>
        );
    }

    if (!profile && !isLoading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-20'>
                <div className='max-w-2xl mx-auto px-4 py-8'>
                    <div className='bg-white rounded-2xl shadow-lg p-8 text-center'>
                        <p className='text-red-600 mb-4'>⚠️ Không thể tải thông tin cá nhân</p>
                        <button
                            onClick={loadProfile}
                            className='px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors'
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-24'>
            <div className='max-w-2xl mx-auto px-4 py-8'>
                {/* Success Toast */}
                {showSuccess && (
                    <div className='fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-50'>
                        <CheckCircle className='w-5 h-5' />
                        <span>Cập nhật thông tin thành công!</span>
                    </div>
                )}

                {/* Back to Dashboard */}
                <Link
                    to='/dashboard'
                    className='inline-flex items-center text-pink-600 hover:text-pink-700 mb-6 transition-colors'
                >
                    <ChevronLeft className='w-4 h-4 mr-1' />
                    Quay lại Dashboard
                </Link>

                {/* Page Header */}
                <div className='bg-white rounded-2xl shadow-lg p-8 mb-6'>
                    <h1 className='text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                        Thông tin cá nhân
                    </h1>
                    <p className='text-gray-600'>Quản lý thông tin tài khoản của bạn</p>
                </div>

                {/* Profile Form */}
                <div className='bg-white rounded-2xl shadow-lg p-8'>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {/* Error Message */}
                        {error && (
                            <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
                                {error}
                            </div>
                        )}

                        {/* Email (Read-only) */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                            <input
                                type='email'
                                value={profile?.email || ''}
                                disabled
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed'
                            />
                            <p className='mt-1 text-xs text-gray-500'>Liên hệ bộ phận hỗ trợ để thay đổi email</p>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label htmlFor='fullName' className='block text-sm font-medium text-gray-700 mb-2'>
                                Họ và tên <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='text'
                                id='fullName'
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder='Nhập họ và tên'
                                required
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all'
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-2'>
                                Số điện thoại <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='tel'
                                id='phone'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder='+84 912 345 678'
                                required
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all'
                            />
                        </div>

                        {/* Language */}
                        <div>
                            <label htmlFor='language' className='block text-sm font-medium text-gray-700 mb-2'>
                                Ngôn ngữ
                            </label>
                            <select
                                id='language'
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as 'vi' | 'ja' | 'en' | 'zh')}
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-white'
                            >
                                <option value='vi'>🇻🇳 Tiếng Việt</option>
                                <option value='en'>🇬🇧 English</option>
                                <option value='ja'>🇯🇵 日本語</option>
                                <option value='zh'>🇨🇳 中文</option>
                            </select>
                        </div>

                        {/* Member Since */}
                        {profile?.createdAt && (
                            <div className='bg-pink-50 border border-pink-200 rounded-lg p-4'>
                                <p className='text-sm text-gray-600'>
                                    Thành viên từ:{' '}
                                    <span className='font-semibold text-pink-700'>
                                        {new Date(profile.createdAt).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </p>
                                {profile.updatedAt && (
                                    <p className='text-xs text-gray-500 mt-1'>
                                        Cập nhật lần cuối:{' '}
                                        {new Date(profile.updatedAt).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className='flex gap-4 pt-4'>
                            <button
                                type='submit'
                                disabled={isSaving}
                                className='flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className='w-5 h-5 animate-spin' />
                                        <span>Đang lưu...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className='w-5 h-5' />
                                        <span>Lưu thay đổi</span>
                                    </>
                                )}
                            </button>

                            <Link
                                to='/dashboard'
                                className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                            >
                                Hủy
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
