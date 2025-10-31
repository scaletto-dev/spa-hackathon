import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, PhoneIcon, ClockIcon, ArrowRightIcon, MailIcon, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BranchMap } from '../components/branches/BranchMap';
import { branchesApi, type Branch } from '../../services/branchesApi';
import { formatOperatingHours, formatPhone } from '../../utils/format';

export function BranchesPage() {
    const { t } = useTranslation('common');
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                setLoading(true);
                const response = await branchesApi.getAllBranches();
                setBranches(response.data);
                if (response.data.length > 0) {
                    setSelectedBranch(response.data[0] || null);
                }
            } catch (err) {
                console.error('Failed to load branches:', err);
                setError('Không thể tải thông tin chi nhánh. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };
        fetchBranches();
    }, []);

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center pt-24">
                <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
            </div>
        );
    }

    if (error || branches.length === 0) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center pt-24">
                <div className="text-center text-red-600 p-8 bg-red-50 rounded-2xl max-w-md">
                    <p>{error || 'Không tìm thấy chi nhánh nào.'}</p>
                </div>
            </div>
        );
    }

    if (!selectedBranch) {
        return null;
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-24">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                            {t('branches.title')}
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        {t('branches.subtitle')}
                    </p>
                </motion.div>
                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                    <div className="lg:col-span-2">
                        <BranchMap
                            branches={branches}
                            selectedBranch={selectedBranch}
                            setSelectedBranch={setSelectedBranch}
                        />
                    </div>
                    <div>
                        <motion.div
                            key={selectedBranch.id}
                            initial={{
                                opacity: 0,
                                x: 20,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            transition={{
                                duration: 0.4,
                            }}
                            className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden h-full"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={selectedBranch.image}
                                    alt={selectedBranch.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <h2 className="text-2xl font-bold text-white">
                                        {selectedBranch.name}
                                    </h2>
                                </div>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="flex items-start gap-3">
                                    <MapPinIcon className="w-5 h-5 text-pink-500 flex-shrink-0 mt-1" />
                                    <p className="text-gray-700">{selectedBranch.address}</p>
                                </div>
                                {selectedBranch.phone && (
                                    <div className="flex items-center gap-3">
                                        <PhoneIcon className="w-5 h-5 text-pink-500 flex-shrink-0" />
                                        <a
                                            href={`tel:${selectedBranch.phone}`}
                                            className="text-gray-700 hover:text-pink-600 transition-colors"
                                        >
                                            {formatPhone(selectedBranch.phone)}
                                        </a>
                                    </div>
                                )}
                                {selectedBranch.email && (
                                    <div className="flex items-center gap-3">
                                        <MailIcon className="w-5 h-5 text-pink-500 flex-shrink-0" />
                                        <a
                                            href={`mailto:${selectedBranch.email}`}
                                            className="text-gray-700 hover:text-pink-600 transition-colors"
                                        >
                                            {selectedBranch.email}
                                        </a>
                                    </div>
                                )}
                                {selectedBranch.operatingHours && (
                                    <div className="flex items-start gap-3">
                                        <ClockIcon className="w-5 h-5 text-pink-500 flex-shrink-0 mt-1" />
                                        <div className="text-gray-700">
                                            {formatOperatingHours(selectedBranch.operatingHours)}
                                        </div>
                                    </div>
                                )}
                                <div className="pt-4">
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedBranch.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                                    >
                                        <MapPinIcon className="w-4 h-4" />
                                        {t('branches.getDirections')}
                                        <ArrowRightIcon className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {branches.map((branch) => (
                        <motion.div
                            key={branch.id}
                            whileHover={{
                                y: -5,
                            }}
                            onClick={() => setSelectedBranch(branch)}
                            className={`cursor-pointer bg-white/70 backdrop-blur-xl rounded-3xl border-2 ${
                                selectedBranch.id === branch.id
                                    ? 'border-pink-500 shadow-lg shadow-pink-200'
                                    : 'border-white/50 shadow-lg'
                            } overflow-hidden transition-all`}
                        >
                            <div className="relative h-40 overflow-hidden">
                                <img
                                    src={branch.image}
                                    alt={branch.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-3 left-3">
                                    <h3 className="text-lg font-bold text-white">{branch.name}</h3>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 text-gray-700 text-sm mb-2">
                                    <MapPinIcon className="w-4 h-4 text-pink-500 flex-shrink-0" />
                                    <p className="line-clamp-1">{branch.address}</p>
                                </div>
                                {branch.phone && (
                                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                                        <PhoneIcon className="w-4 h-4 text-pink-500 flex-shrink-0" />
                                        <p>{formatPhone(branch.phone)}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    className="bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 rounded-3xl p-1"
                >
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            {t('branches.readyToSchedule')}
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                            {t('branches.readyToScheduleDescription')}
                        </p>
                        <motion.a
                            href="/booking"
                            whileHover={{
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-xl"
                        >
                            {t('branches.bookYourVisit')}
                            <ArrowRightIcon className="w-5 h-5" />
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default BranchesPage;
