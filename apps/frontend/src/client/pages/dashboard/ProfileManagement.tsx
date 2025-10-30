import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Save, Loader2, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getMemberProfile, updateMemberProfile, type MemberProfile } from '../../../api/adapters/member';

export default function ProfileManagement() {
    const { t } = useTranslation('common');
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
            setError(t('profileManagement.loadError'));
            console.error('Load profile error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim()) {
            setError(t('profileManagement.validation.nameRequired'));
            return;
        }

        if (!phone.trim()) {
            setError(t('profileManagement.validation.phoneRequired'));
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

            // Update localStorage to sync with Header and other components
            const userDataStr = localStorage.getItem('user_data');
            if (userDataStr) {
                const userData = JSON.parse(userDataStr);
                userData.fullName = updated.fullName;
                userData.phone = updated.phone;
                userData.language = updated.language;
                localStorage.setItem('user_data', JSON.stringify(userData));
                
                // Dispatch custom event to notify Header component
                window.dispatchEvent(new Event('userProfileUpdated'));
            }

            // Show success toast
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            setError(t('profileManagement.updateError'));
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
                    <span className='ml-3 text-gray-600'>{t('profileManagement.loadingProfile')}</span>
                </div>
            </div>
        );
    }

    if (!profile && !isLoading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-20'>
                <div className='max-w-2xl mx-auto px-4 py-8'>
                    <div className='bg-white rounded-2xl shadow-lg p-8 text-center'>
                        <p className='text-red-600 mb-4'>⚠️ {t('profileManagement.loadError')}</p>
                        <button
                            onClick={loadProfile}
                            className='px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors'
                        >
                            {t('profileManagement.retry')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-24 pb-12'>
            <div className='max-w-5xl mx-auto px-4'>
                {/* Success Toast */}
                {showSuccess && (
                    <div className='fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-50'>
                        <CheckCircle className='w-5 h-5' />
                        <span>{t('profileManagement.updateSuccess')}</span>
                    </div>
                )}

                {/* Back to Dashboard */}
                <Link
                    to='/dashboard'
                    className='inline-flex items-center text-pink-600 hover:text-pink-700 mb-8 transition-colors font-medium'
                >
                    <ChevronLeft className='w-4 h-4 mr-1' />
                    {t('profileManagement.backToDashboard')}
                </Link>

                {/* Page Header */}
                <div className='bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-3xl shadow-2xl p-8 mb-8 text-white'>
                    <h1 className='text-4xl font-bold mb-2'>{t('profileManagement.title')}</h1>
                    <p className='text-pink-100 text-lg'>{t('profileManagement.updateTheme')}</p>
                </div>

                {/* Two Column Layout */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Left Column - Account Info */}
                    <div className='lg:col-span-1'>
                        <div className='bg-white rounded-2xl shadow-lg p-6 border border-pink-100'>
                            <div className='text-center mb-6'>
                                <div className='w-20 h-20 mx-auto bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-4 text-2xl font-bold shadow-lg text-white'>
                                    {profile?.fullName?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <h2 className='text-xl font-bold text-gray-800'>{profile?.fullName}</h2>
                                <p className='text-pink-600 text-sm font-medium'>{profile?.email}</p>
                            </div>

                            <div className='border-t border-gray-200 pt-6 space-y-4'>
                                <div className='bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-100'>
                                    <p className='text-xs text-gray-500 mb-1'>{t('profileManagement.phone')}</p>
                                    <p className='font-semibold text-gray-800'>{profile?.phone || '-'}</p>
                                </div>

                                <div className='bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100'>
                                    <p className='text-xs text-gray-500 mb-1'>{t('profileManagement.language')}</p>
                                    <p className='font-semibold text-gray-800'>
                                        {language === 'vi' && t('profileManagement.language_vi')}
                                        {language === 'en' && t('profileManagement.language_en')}
                                        {language === 'ja' && t('profileManagement.language_ja')}
                                        {language === 'zh' && t('profileManagement.language_zh')}
                                    </p>
                                </div>

                                {profile?.createdAt && (
                                    <>
                                        <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100'>
                                            <p className='text-xs text-gray-500 mb-1'>{t('profileManagement.memberSince')}</p>
                                            <p className='font-semibold text-gray-800 text-sm'>
                                                {new Date(profile.createdAt).toLocaleDateString('vi-VN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>

                                        {profile.updatedAt && (
                                            <div className='bg-gradient-to-r from-indigo-50 to-pink-50 rounded-lg p-4 border border-indigo-100'>
                                                <p className='text-xs text-gray-500 mb-1'>{t('profileManagement.lastUpdated')}</p>
                                                <p className='font-semibold text-gray-800 text-sm'>
                                                    {new Date(profile.updatedAt).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Edit Form */}
                    <div className='lg:col-span-2'>
                        <div className='bg-white rounded-2xl shadow-lg p-8 border border-purple-100'>
                            <h3 className='text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2'>
                            </h3>

                            <form onSubmit={handleSubmit} className='space-y-6'>
                                {/* Error Message */}
                                {error && (
                                    <div className='bg-red-50 border border-red-300 text-red-700 px-5 py-4 rounded-lg flex items-start gap-3'>
                                        <span className='text-lg'>⚠️</span>
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Email (Read-only) */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-3'>
                                        {t('profileManagement.emailLabel')}
                                    </label>
                                    <input
                                        type='email'
                                        value={profile?.email || ''}
                                        disabled
                                        className='w-full px-5 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed placeholder-gray-400'
                                    />
                                    <p className='mt-2 text-xs text-gray-500'>
                                        {t('profileManagement.emailReadOnly')}
                                    </p>
                                </div>

                                {/* Full Name */}
                                <div>
                                    <label htmlFor='fullName' className='block text-sm font-semibold text-gray-700 mb-3'>
                                        {t('profileManagement.fullNameLabel')} <span className='text-red-500'>*</span>
                                    </label>
                                    <input
                                        type='text'
                                        id='fullName'
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder={t('profileManagement.enterFullName')}
                                        required
                                        className='w-full px-5 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all'
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label htmlFor='phone' className='block text-sm font-semibold text-gray-700 mb-3'>
                                        {t('profileManagement.phoneLabel')} <span className='text-red-500'>*</span>
                                    </label>
                                    <input
                                        type='tel'
                                        id='phone'
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder={t('profileManagement.enterPhoneNumber')}
                                        required
                                        className='w-full px-5 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all'
                                    />
                                </div>

                                {/* Language */}
                                <div>
                                    <label htmlFor='language' className='block text-sm font-semibold text-gray-700 mb-3'>
                                        {t('profileManagement.languageLabel')}
                                    </label>
                                    <select
                                        id='language'
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value as 'vi' | 'ja' | 'en' | 'zh')}
                                        className='w-full px-5 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all'
                                    >
                                        <option value='vi'>{t('profileManagement.language_vi')}</option>
                                        <option value='en'>{t('profileManagement.language_en')}</option>
                                        <option value='ja'>{t('profileManagement.language_ja')}</option>
                                        <option value='zh'>{t('profileManagement.language_zh')}</option>
                                    </select>
                                </div>

                                {/* Submit Buttons */}
                                <div className='flex gap-4 pt-6 border-t border-gray-200'>
                                    <button
                                        type='submit'
                                        disabled={isSaving}
                                        className='flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className='w-5 h-5 animate-spin' />
                                                <span>{t('profileManagement.saving')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className='w-5 h-5' />
                                                <span>{t('profileManagement.saveChanges')}</span>
                                            </>
                                        )}
                                    </button>

                                    <Link
                                        to='/dashboard'
                                        className='px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors'
                                    >
                                        {t('profileManagement.cancel')}
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
