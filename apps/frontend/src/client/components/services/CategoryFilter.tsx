import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { ServiceCategory } from '../../../types/service';

interface CategoryFilterProps {
    categories: ServiceCategory[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    loading?: boolean;
}

export function CategoryFilter({
    categories,
    selectedCategory,
    onSelectCategory,
    loading,
}: CategoryFilterProps) {
    return (
        <section className="w-full py-8 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-4">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {loading ? (
                            <div className="flex items-center gap-2 text-gray-500 py-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Đang tải danh mục...</span>
                            </div>
                        ) : (
                            <>
                                <motion.button
                                    key="All"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onSelectCategory('All')}
                                    className={`px-6 py-3 rounded-full font-semibold transition-all ${
                                        selectedCategory === 'All'
                                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                                            : 'bg-white/80 text-gray-700 hover:bg-white border-2 border-pink-100'
                                    }`}
                                >
                                    Tất cả
                                </motion.button>
                                {categories.map((category) => (
                                    <motion.button
                                        key={category.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onSelectCategory(category.id)}
                                        className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
                                            selectedCategory === category.id
                                                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                                                : 'bg-white/80 text-gray-700 hover:bg-white border-2 border-pink-100'
                                        }`}
                                    >
                                        {category.name}
                                        <span className="text-xs opacity-75">
                                            ({category.serviceCount})
                                        </span>
                                    </motion.button>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
