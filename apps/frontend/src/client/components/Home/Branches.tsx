import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, PhoneIcon, ClockIcon, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllBranches, formatOperatingHours, type Branch } from '../../../services/branchesApi';

export function Branches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const response = await getAllBranches({ limit: 3 }); // Get 3 branches for home page
        setBranches(response.data);
        setError(null);
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
      <section className="w-full py-24 px-6 bg-gradient-to-b from-pink-50/30 to-transparent">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-24 px-6 bg-gradient-to-b from-pink-50/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-500 p-8 bg-red-50 rounded-2xl">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-24 px-6 bg-gradient-to-b from-pink-50/30 to-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Chi Nhánh Của Chúng Tôi
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Ghé thăm chúng tôi tại các chi nhánh tiện lợi
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {branches.map((branch, index) => {
            const firstImage = branch.images && branch.images.length > 0 
              ? branch.images[0] 
              : 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop';
            
            const formattedHours = formatOperatingHours(branch.operatingHours);

            return (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <Link to={`/branches/${branch.slug}`} className="block h-full">
                  <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden hover:shadow-2xl transition-all h-full">
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={firstImage} 
                        alt={branch.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white">
                          {branch.name}
                        </h3>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPinIcon className="w-5 h-5 text-pink-500 flex-shrink-0 mt-1" />
                        <p className="text-gray-700 line-clamp-2">{branch.address}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="w-5 h-5 text-pink-500 flex-shrink-0" />
                        <p className="text-gray-700">{branch.phone}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <ClockIcon className="w-5 h-5 text-pink-500 flex-shrink-0" />
                        <p className="text-gray-700">{formattedHours}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Branches Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            to="/branches"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all"
          >
            Xem Tất Cả Chi Nhánh
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}