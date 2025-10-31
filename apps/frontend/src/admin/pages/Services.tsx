import { useState } from "react";
import {
   SparklesIcon,
   ClockIcon,
   DollarSignIcon,
   EyeIcon,
   EyeOffIcon,
   Edit3Icon,
   PlusIcon,
   Trash2Icon,
   SearchIcon,
   FilterIcon,
} from "lucide-react";
import { adminServicesAPI } from "../../api/adapters/admin";
import { useAdminList } from "../../hooks/useAdmin";
import { Toast } from "../components/Toast";
import { ServiceModal } from "../components/modals/ServiceModal";

export function Services() {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedService, setSelectedService] = useState<any>(null);
   const [searchQuery, setSearchQuery] = useState("");
   const [activeFilter, setActiveFilter] = useState("All Services");
   const [toast, setToast] = useState<{
      message: string;
      type: "success" | "error" | "warning";
   } | null>(null);

   const {
      data: services = [],
      loading,
      fetch,
      page,
      limit,
      total,
      goToPage,
      setPageSize,
   } = useAdminList(adminServicesAPI.getAll);

   const handleServiceSuccess = () => {
      setIsModalOpen(false);
      setSelectedService(null);
      setToast({ message: "Service saved successfully!", type: "success" });
      fetch();
   };

   const handleEditService = (service: any) => {
      setSelectedService(service);
      setIsModalOpen(true);
   };

   const handleToggleActive = async (serviceId: string) => {
      try {
         await adminServicesAPI.toggleActive(serviceId);
         setToast({ message: "Service visibility updated!", type: "success" });
         fetch();
      } catch (err: any) {
         setToast({ message: err.message, type: "error" });
      }
   };

   const handleDelete = async (serviceId: string, serviceName: string) => {
      if (confirm(`Delete "${serviceName}"?`)) {
         try {
            await adminServicesAPI.delete(serviceId);
            setToast({ message: "Service deleted!", type: "success" });
            fetch();
         } catch (err: any) {
            setToast({ message: err.message, type: "error" });
         }
      }
   };

   // Filter services based on search and active status
   const filteredServices = (services || []).filter((service: any) => {
      const matchesSearch =
         service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         service.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
         activeFilter === "All Services" ||
         (activeFilter === "Active" && service.active) ||
         (activeFilter === "Inactive" && !service.active);

      return matchesSearch && matchesStatus;
   });

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold text-gray-800">Services</h1>
               <p className="text-gray-600 mt-1">
                  Manage your clinic services and treatments
               </p>
            </div>
            <button
               onClick={() => setIsModalOpen(true)}
               className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm flex items-center gap-2">
               <PlusIcon className="w-5 h-5" />
               Add New Service
            </button>
         </div>
         <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-white" />
               </div>
               <p className="text-sm text-gray-700">
                  <span className="font-semibold">Total Services:</span>{" "}
                  {services?.length || 0} services
               </p>
            </div>
         </div>

         {/* Search and Filter */}
         <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm p-4 flex items-center gap-4">
            <div className="relative flex-1">
               <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input
                  type="text"
                  placeholder="Search services by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
               />
            </div>
            <select
               value={activeFilter}
               onChange={(e) => setActiveFilter(e.target.value)}
               className="px-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm">
               <option>All Services</option>
               <option>Active</option>
               <option>Inactive</option>
            </select>
            <button className="p-2 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors">
               <FilterIcon className="w-5 h-5 text-gray-600" />
            </button>
         </div>

         {loading ? (
            <div className="flex justify-center py-12">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {(filteredServices || []).map((service: any) => (
                  <div
                     key={service.id}
                     className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-lg transition-all group">
                     <div className="relative h-48 overflow-hidden bg-gray-200">
                        {service.images?.[0] ? (
                           <img
                              src={service.images[0]}
                              alt={service.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                           />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No image
                           </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                           {service.category?.name || "Uncategorized"}
                        </div>
                     </div>
                     <div className="p-5">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                           {service.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                           {service.description}
                        </p>
                        <div className="space-y-2 mb-4">
                           <div className="flex items-center gap-2 text-sm text-gray-600">
                              <ClockIcon className="w-4 h-4 text-pink-400" />
                              <span>{service.duration} min</span>
                           </div>
                           <div className="flex items-center gap-2 text-sm text-gray-600">
                              <DollarSignIcon className="w-4 h-4 text-purple-400" />
                              <span className="font-semibold text-gray-800">
                                 ${service.price}
                              </span>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 pt-4 border-t border-pink-100">
                           <button
                              onClick={() => handleEditService(service)}
                              className="flex-1 py-2 bg-pink-50 text-pink-600 rounded-lg text-sm font-medium hover:bg-pink-100 transition-colors flex items-center justify-center gap-2">
                              <Edit3Icon className="w-4 h-4" />
                              Edit
                           </button>
                           <button
                              onClick={() => handleToggleActive(service.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                 service.active
                                    ? "bg-green-50 text-green-600 hover:bg-green-100"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}>
                              {service.active ? (
                                 <EyeIcon className="w-4 h-4" />
                              ) : (
                                 <EyeOffIcon className="w-4 h-4" />
                              )}
                           </button>
                           <button
                              onClick={() =>
                                 handleDelete(service.id, service.name)
                              }
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                              <Trash2Icon className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </div>
                  ))}
            </div>
         )}

         {/* Pagination */}
         {!loading && services.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-pink-100 bg-pink-50/30">
               <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Items per page:</span>
                  <select
                     value={limit}
                     onChange={(e) => setPageSize(Number(e.target.value))}
                     className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                     <option value={10}>10</option>
                     <option value={20}>20</option>
                     <option value={50}>50</option>
                     <option value={100}>100</option>
                  </select>
               </div>

               <div className="flex flex-1 items-center justify-center gap-4">
                  <button
                     onClick={() => goToPage(page - 1)}
                     disabled={page === 1}
                     className="px-4 py-2 rounded-lg border border-gray-300 hover:border-pink-500 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                     Previous
                  </button>

                  <div className="text-sm text-gray-600 min-w-max">
                     Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{Math.ceil(total / limit)}</span>
                  </div>

                  <button
                     onClick={() => goToPage(page + 1)}
                     disabled={page >= Math.ceil(total / limit)}
                     className="px-4 py-2 rounded-lg border border-gray-300 hover:border-pink-500 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                     Next
                  </button>
               </div>

               <div className="text-sm text-gray-500">
                  {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} of {total}
               </div>
            </div>
         )}
         <ServiceModal
            isOpen={isModalOpen}
            onClose={() => {
               setIsModalOpen(false);
               setSelectedService(null);
            }}
            onSuccess={handleServiceSuccess}
            service={selectedService}
            mode={selectedService ? "edit" : "create"}
         />
         {toast && (
            <Toast
               message={toast.message}
               type={toast.type}
               onClose={() => setToast(null)}
            />
         )}
      </div>
   );
}
export { Services as default };
