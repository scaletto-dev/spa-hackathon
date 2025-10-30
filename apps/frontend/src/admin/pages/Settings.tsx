import { useState } from 'react';
import { UserIcon, BellIcon, ShieldIcon, CreditCardIcon, GlobeIcon, SparklesIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Settings() {
    const { t } = useTranslation('common');
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        {
            id: 'profile',
            label: t('settings.profile'),
            icon: UserIcon,
        },
        {
            id: 'notifications',
            label: t('settings.notifications'),
            icon: BellIcon,
        },
        {
            id: 'security',
            label: t('settings.security'),
            icon: ShieldIcon,
        },
        {
            id: 'billing',
            label: t('settings.billing'),
            icon: CreditCardIcon,
        },
        {
            id: 'integrations',
            label: t('settings.integrations'),
            icon: GlobeIcon,
        },
    ];

    return (
        <div className='space-y-6'>
            <div>
                <h1 className='text-3xl font-bold text-gray-800'>{t('settings.title')}</h1>
                <p className='text-gray-600 mt-1'>{t('settings.subtitle')}</p>
            </div>
            <div className='flex gap-6'>
                <div className='w-64 flex-shrink-0'>
                    <div className='bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm p-2'>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600 shadow-sm'
                                        : 'text-gray-600 hover:bg-pink-50'
                                }`}
                            >
                                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-pink-500' : ''}`} />
                                <span className='font-medium text-sm'>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className='flex-1'>
                    <div className='bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm p-6'>
                        {activeTab === 'profile' && (
                            <div className='space-y-6'>
                                <h2 className='text-xl font-semibold text-gray-800'>{t('settings.profileSettings')}</h2>
                                <div className='flex items-center gap-6'>
                                    <img
                                        src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
                                        alt='Profile'
                                        className='w-24 h-24 rounded-full border-4 border-pink-200'
                                    />
                                    <div>
                                        <button className='px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg text-sm font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm'>
                                            {t('settings.changePhoto')}
                                        </button>
                                        <p className='text-xs text-gray-500 mt-2'>{t('settings.photoFormat')}</p>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            {t('settings.firstName')}
                                        </label>
                                        <input
                                            type='text'
                                            defaultValue='Admin'
                                            className='w-full px-4 py-2 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/30'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            {t('settings.lastName')}
                                        </label>
                                        <input
                                            type='text'
                                            defaultValue='User'
                                            className='w-full px-4 py-2 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/30'
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        {t('settings.email')}
                                    </label>
                                    <input
                                        type='email'
                                        defaultValue='admin@beautyclinic.com'
                                        className='w-full px-4 py-2 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/30'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        {t('settings.bio')}
                                    </label>
                                    <textarea
                                        rows={4}
                                        defaultValue={t('settings.bioDefault')}
                                        className='w-full px-4 py-2 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/30 resize-none'
                                    />
                                </div>
                                <button className='px-6 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm'>
                                    {t('settings.saveChanges')}
                                </button>
                            </div>
                        )}
                        {activeTab === 'notifications' && (
                            <div className='space-y-6'>
                                <h2 className='text-xl font-semibold text-gray-800'>
                                    {t('settings.notificationPreferences')}
                                </h2>
                                <div className='space-y-4'>
                                    <div className='flex items-center justify-between p-4 bg-pink-50/50 rounded-xl'>
                                        <div>
                                            <h3 className='font-medium text-gray-800'>
                                                {t('settings.emailNotifications')}
                                            </h3>
                                            <p className='text-sm text-gray-600'>
                                                {t('settings.emailNotificationsDesc')}
                                            </p>
                                        </div>
                                        <label className='relative inline-flex items-center cursor-pointer'>
                                            <input type='checkbox' defaultChecked className='sr-only peer' />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-400 peer-checked:to-purple-400" />
                                        </label>
                                    </div>
                                    <div className='flex items-center justify-between p-4 bg-pink-50/50 rounded-xl'>
                                        <div>
                                            <h3 className='font-medium text-gray-800'>
                                                {t('settings.pushNotifications')}
                                            </h3>
                                            <p className='text-sm text-gray-600'>
                                                {t('settings.pushNotificationsDesc')}
                                            </p>
                                        </div>
                                        <label className='relative inline-flex items-center cursor-pointer'>
                                            <input type='checkbox' defaultChecked className='sr-only peer' />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-400 peer-checked:to-purple-400" />
                                        </label>
                                    </div>
                                    <div className='flex items-center justify-between p-4 bg-pink-50/50 rounded-xl'>
                                        <div>
                                            <h3 className='font-medium text-gray-800'>
                                                {t('settings.smsNotifications')}
                                            </h3>
                                            <p className='text-sm text-gray-600'>
                                                {t('settings.smsNotificationsDesc')}
                                            </p>
                                        </div>
                                        <label className='relative inline-flex items-center cursor-pointer'>
                                            <input type='checkbox' className='sr-only peer' />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-400 peer-checked:to-purple-400" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'security' && (
                            <div className='space-y-6'>
                                <h2 className='text-xl font-semibold text-gray-800'>
                                    {t('settings.securitySettings')}
                                </h2>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        {t('settings.currentPassword')}
                                    </label>
                                    <input
                                        type='password'
                                        placeholder={t('settings.currentPasswordPlaceholder')}
                                        className='w-full px-4 py-2 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/30'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        {t('settings.newPassword')}
                                    </label>
                                    <input
                                        type='password'
                                        placeholder={t('settings.newPasswordPlaceholder')}
                                        className='w-full px-4 py-2 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/30'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        {t('settings.confirmNewPassword')}
                                    </label>
                                    <input
                                        type='password'
                                        placeholder={t('settings.confirmNewPasswordPlaceholder')}
                                        className='w-full px-4 py-2 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/30'
                                    />
                                </div>
                                <button className='px-6 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm'>
                                    {t('settings.updatePassword')}
                                </button>
                                <div className='border-t border-pink-100 pt-6'>
                                    <h3 className='font-medium text-gray-800 mb-4'>{t('settings.twoFactorAuth')}</h3>
                                    <div className='flex items-center justify-between p-4 bg-pink-50/50 rounded-xl'>
                                        <div>
                                            <p className='text-sm text-gray-700'>{t('settings.twoFactorAuthDesc')}</p>
                                        </div>
                                        <button className='px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg text-sm font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm'>
                                            {t('settings.enable')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'billing' && (
                            <div className='space-y-6'>
                                <h2 className='text-xl font-semibold text-gray-800'>
                                    {t('settings.billingSubscription')}
                                </h2>
                                <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100'>
                                    <div className='flex items-center justify-between mb-4'>
                                        <div>
                                            <h3 className='text-lg font-semibold text-gray-800'>
                                                {t('settings.premiumPlan')}
                                            </h3>
                                            <p className='text-sm text-gray-600'>{t('settings.billedMonthly')}</p>
                                        </div>
                                        <div className='text-right'>
                                            <p className='text-3xl font-bold text-gray-800'>$99</p>
                                            <p className='text-sm text-gray-600'>{t('settings.perMonth')}</p>
                                        </div>
                                    </div>
                                    <button className='w-full py-2 bg-white rounded-lg text-sm font-medium text-pink-600 hover:bg-pink-50 transition-colors'>
                                        {t('settings.manageSubscription')}
                                    </button>
                                </div>
                                <div>
                                    <h3 className='font-medium text-gray-800 mb-3'>{t('settings.paymentMethod')}</h3>
                                    <div className='flex items-center gap-4 p-4 bg-pink-50/50 rounded-xl'>
                                        <CreditCardIcon className='w-8 h-8 text-pink-400' />
                                        <div className='flex-1'>
                                            <p className='font-medium text-gray-800'>•••• •••• •••• 4242</p>
                                            <p className='text-sm text-gray-600'>{t('settings.expiresDate')} 12/25</p>
                                        </div>
                                        <button className='text-sm text-pink-600 hover:text-pink-700 font-medium'>
                                            {t('settings.update')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'integrations' && (
                            <div className='space-y-6'>
                                <h2 className='text-xl font-semibold text-gray-800'>
                                    {t('settings.integrationsTitle')}
                                </h2>
                                <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100'>
                                    <div className='flex items-center gap-2'>
                                        <SparklesIcon className='w-5 h-5 text-purple-600' />
                                        <p className='text-sm text-gray-700'>{t('settings.integrationsDesc')}</p>
                                    </div>
                                </div>
                                <div className='space-y-3'>
                                    <div className='flex items-center justify-between p-4 bg-pink-50/50 rounded-xl'>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-10 h-10 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center'>
                                                <GlobeIcon className='w-5 h-5 text-white' />
                                            </div>
                                            <div>
                                                <h3 className='font-medium text-gray-800'>
                                                    {t('settings.googleCalendar')}
                                                </h3>
                                                <p className='text-sm text-gray-600'>
                                                    {t('settings.syncAppointments')}
                                                </p>
                                            </div>
                                        </div>
                                        <button className='px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg text-sm font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm'>
                                            {t('settings.connect')}
                                        </button>
                                    </div>
                                    <div className='flex items-center justify-between p-4 bg-pink-50/50 rounded-xl'>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-10 h-10 rounded-lg bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center'>
                                                <CreditCardIcon className='w-5 h-5 text-white' />
                                            </div>
                                            <div>
                                                <h3 className='font-medium text-gray-800'>{t('settings.stripe')}</h3>
                                                <p className='text-sm text-gray-600'>
                                                    {t('settings.paymentProcessing')}
                                                </p>
                                            </div>
                                        </div>
                                        <span className='text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full'>
                                            {t('settings.connected')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Settings;
