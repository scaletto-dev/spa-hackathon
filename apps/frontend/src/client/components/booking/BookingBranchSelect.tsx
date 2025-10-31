import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ArrowLeftIcon, MapPinIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BookingStepProps } from './types';
import { getBranches, Branch } from '../../../services/bookingApi';

export function BookingBranchSelect({
    bookingData,
    updateBookingData,
    onNext,
    onPrev,
}: BookingStepProps) {
    const { t } = useTranslation('common');
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadBranches = async () => {
            try {
                setLoading(true);
                const data = await getBranches();
                setBranches(data);
            } catch (err) {
                setError('Failed to load branches');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadBranches();
    }, []);

    const handleSelectBranch = (branch: Branch) => {
        updateBookingData({
            branch,
        });
    };
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                y: -20,
            }}
            transition={{
                duration: 0.5,
            }}
        >
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {t('bookings.chooseABranch')}
                </h2>
                <p className="text-gray-600">{t('bookings.selectLocation')}</p>
            </div>

            {loading && <div className="text-center py-12 text-gray-500">Loading branches...</div>}
            {error && <div className="text-center py-12 text-red-500">{error}</div>}

            {!loading && !error && (
                <>
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {branches.map((branch) => {
                            const branchImage =
                                branch.images && branch.images.length > 0
                                    ? branch.images[0]
                                    : 'https://via.placeholder.com/400x300?text=' +
                                      encodeURIComponent(branch.name);

                            return (
                                <motion.div
                                    key={branch.id}
                                    whileHover={{
                                        y: -5,
                                    }}
                                    onClick={() => handleSelectBranch(branch)}
                                    className={`cursor-pointer bg-white/70 backdrop-blur-xl rounded-3xl border-2 ${
                                        bookingData.branch?.id === branch.id
                                            ? 'border-pink-500 shadow-lg shadow-pink-200'
                                            : 'border-white/50 shadow-lg'
                                    } overflow-hidden transition-all`}
                                >
                                    <div className="relative h-44 overflow-hidden">
                                        <img
                                            src={branchImage}
                                            alt={branch.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-xl font-bold text-white">
                                                {branch.name}
                                            </h3>
                                        </div>
                                        {bookingData.branch?.id === branch.id && (
                                            <div className="absolute top-4 right-4 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                                                <MapPinIcon className="w-5 h-5 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <div className="text-gray-700 mb-2 text-sm font-medium">
                                            {branch.address}
                                        </div>
                                        <div className="text-gray-600 text-xs">{branch.phone}</div>
                                        {branch.email && (
                                            <div className="text-gray-600 text-xs mt-1">
                                                {branch.email}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between mt-12">
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            onClick={onPrev}
                            className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-pink-200 text-gray-700 rounded-full font-semibold shadow-lg"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                            {t('common.back')}
                        </motion.button>
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            onClick={onNext}
                            disabled={!bookingData.branch}
                            className={`flex items-center gap-2 px-8 py-4 rounded-full font-semibold shadow-xl ${
                                bookingData.branch
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {t('common.continue')}
                            <ArrowRightIcon className="w-5 h-5" />
                        </motion.button>
                    </div>
                </>
            )}
        </motion.div>
    );
}
