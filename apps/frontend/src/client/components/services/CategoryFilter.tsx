import React from 'react';
import { motion } from 'framer-motion';
interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}
export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory
}: CategoryFilterProps) {
  return <section className="w-full py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => <motion.button key={category} whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} onClick={() => onSelectCategory(category)} className={`px-6 py-3 rounded-full font-semibold transition-all ${selectedCategory === category ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg' : 'bg-white/80 text-gray-700 hover:bg-white border-2 border-pink-100'}`}>
                {category}
              </motion.button>)}
          </div>
        </div>
      </div>
    </section>;
}