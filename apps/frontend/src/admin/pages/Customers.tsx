import { useState } from "react";
import {
   SearchIcon,
   FilterIcon,
   PlusIcon,
   EyeIcon,
   Edit3Icon,
   XCircleIcon,
   TrendingUpIcon,
   StarIcon,
} from "lucide-react";
import { CustomDropdown } from "../components/CustomDropdown";
import { CustomerModal } from "../components/modals/CustomerModal";
import { CustomerDetailsModal } from "../components/modals/CustomerDetailsModal";
import { Toast } from "../components/Toast";
import { adminCustomersAPI } from "../../api/adapters/admin";
import { useAdminList } from "../../hooks/useAdmin";
const tierColors = {
   VIP: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
   Gold: "bg-gradient-to-r from-yellow-400 to-orange-400 text-white",
   Silver: "bg-gradient-to-r from-gray-300 to-gray-400 text-white",
   New: "bg-gradient-to-r from-blue-400 to-cyan-400 text-white",
};

export function Customers() {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [statusFilter, setStatusFilter] = useState("All Status");
   const [tierFilter, setTierFilter] = useState("All Tiers");
   const [selectedCustomer, setSelectedCustomer] = useState<{
      id: string;
      mode: "view" | "edit";
   } | null>(null);
   const [toast, setToast] = useState<{
      message: string;
      type: "success" | "error" | "warning";
   } | null>(null);

   // Use API hook for fetching customers
   const {
      data: customers,
      loading,
      fetch,
      page,
      limit,
      total,
      goToPage,
      setPageSize,
   } = useAdminList(adminCustomersAPI.getAll);

   const handleCustomerAdded = () => {
      setToast({
         message: "Customer added successfully!",
         type: "success",
      });
      setIsModalOpen(false);
      fetch(); // Refresh list
   };

   const handleCustomerUpdated = () => {
      setToast({
         message: "Customer updated successfully!",
         type: "success",
      });
      setSelectedCustomer(null);
      fetch(); // Refresh list
   };

   const handleCustomerDeleted = async (customerId: string) => {
      if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
         try {
            await adminCustomersAPI.delete(customerId);
            setToast({
               message: "Customer deleted successfully!",
               type: "success",
            });
            fetch(); // Refresh list
         } catch (err: any) {
            setToast({
               message: err.message || "Failed to delete customer",
               type: "error",
            });
         }
      }
   };

   // Filter customers based on search and status
   const filteredCustomers = (customers || []).filter((customer: any) => {
      const matchesSearch =
         customer.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         customer.phone?.includes(searchQuery);

      const matchesStatus =
         statusFilter === "All Status" ||
         (statusFilter === "Verified" && customer.emailVerified) ||
         (statusFilter === "Pending" && !customer.emailVerified);

      return matchesSearch && matchesStatus;
   });
   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
               <p className="text-gray-600 mt-1">Manage your client database</p>
            </div>
            <button
               onClick={() => setIsModalOpen(true)}
               className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm flex items-center gap-2">
               <PlusIcon className="w-5 h-5" />
               Add Customer
            </button>
         </div>
         <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
            <div className="flex items-start justify-between">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center">
                     <TrendingUpIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                     <p className="text-sm font-semibold text-gray-800">
                        AI Insights
                     </p>
                     <p className="text-xs text-gray-600">
                        Most frequent customers: Sarah Johnson (24 visits),
                        Michael Chen (12 visits)
                     </p>
                  </div>
               </div>
               <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  High Retention: 88%
               </span>
            </div>
         </div>
         <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-pink-100 flex items-center gap-4">
               <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                     type="text"
                     placeholder="Search customers by name, email, or phone..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-10 pr-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                  />
               </div>
               <CustomDropdown
                  value={statusFilter}
                  onChange={setStatusFilter}
                  color="pink"
                  options={[
                     { value: "All Status", label: "All Status" },
                     { value: "Verified", label: "Verified", icon: "✓" },
                     { value: "Pending", label: "Pending", icon: "⏳" },
                  ]}
               />
               <CustomDropdown
                  value={tierFilter}
                  onChange={setTierFilter}
                  color="purple"
                  options={[
                     { value: "All Tiers", label: "All Tiers" },
                     { value: "VIP", label: "VIP", icon: "👑" },
                     { value: "Gold", label: "Gold", icon: "🥇" },
                     { value: "Silver", label: "Silver", icon: "🥈" },
                     { value: "New", label: "New", icon: "🆕" },
                  ]}
               />
               <button className="p-2 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors">
                  <FilterIcon className="w-5 h-5 text-gray-600" />
               </button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead className="bg-pink-50/50">
                     <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                           Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                           Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                           Total Bookings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                           Membership
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                           Retention
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                           Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100">
                     {(filteredCustomers || []).map((customer: any) => (
                        <tr
                           key={customer.id}
                           className="hover:bg-pink-50/30 transition-colors">
                           <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full border-2 border-pink-200 bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold">
                                    {customer.fullName?.charAt(0) || "?"}
                                 </div>
                                 <span className="font-medium text-gray-800">
                                    {customer.fullName || "N/A"}
                                 </span>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="text-sm">
                                 <div className="text-gray-700">
                                    {customer.email}
                                 </div>
                                 <div className="text-gray-500">
                                    {customer.phone}
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-sm font-semibold text-gray-800">
                                 {customer._count?.bookings || 0}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <span
                                 className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${tierColors["Gold"]}`}>
                                 <StarIcon className="w-3 h-3 mr-1" />
                                 Member
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-sm font-medium text-green-600">
                                 -
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <span
                                 className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                    customer.emailVerified
                                       ? "bg-green-100 text-green-700"
                                       : "bg-gray-100 text-gray-700"
                                 }`}>
                                 {customer.emailVerified
                                    ? "Verified"
                                    : "Pending"}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                 <button
                                    onClick={() =>
                                       setSelectedCustomer({
                                          id: customer.id,
                                          mode: "view",
                                       })
                                    }
                                    className="p-2 rounded-lg hover:bg-blue-100 transition-colors">
                                    <EyeIcon className="w-4 h-4 text-blue-600" />
                                 </button>
                                 <button
                                    onClick={() =>
                                       setSelectedCustomer({
                                          id: customer.id,
                                          mode: "edit",
                                       })
                                    }
                                    className="p-2 rounded-lg hover:bg-pink-100 transition-colors">
                                    <Edit3Icon className="w-4 h-4 text-gray-600" />
                                 </button>
                                 <button
                                    onClick={() =>
                                       handleCustomerDeleted(customer.id)
                                    }
                                    className="p-2 rounded-lg hover:bg-red-100 transition-colors">
                                    <XCircleIcon className="w-4 h-4 text-red-500" />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {/* Pagination */}
            {!loading && customers.length > 0 && (
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
         </div>
         <CustomerModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleCustomerAdded}
         />
         <CustomerDetailsModal
            isOpen={!!selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
            customerId={selectedCustomer?.id || null}
            mode={selectedCustomer?.mode || "view"}
            onUpdate={handleCustomerUpdated}
            onDelete={() => {
               setSelectedCustomer(null);
               setToast({
                  message: "Customer deleted successfully!",
                  type: "success",
               });
            }}
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

export default Customers;
