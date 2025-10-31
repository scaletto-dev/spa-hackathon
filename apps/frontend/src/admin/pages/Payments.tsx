import { useState, useEffect, useRef } from "react";
import {
   CheckCircleIcon,
   XCircleIcon,
   ClockIcon,
   DollarSignIcon,
   FilterIcon,
   SearchIcon,
   TrendingUpIcon,
   ChevronDownIcon,
} from "lucide-react";
import { Toast } from "../components/Toast";
import { adminPaymentsAPI } from "../../api/adapters/admin";
import { useAdminList } from "../../hooks/useAdmin";

export function Payments() {
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedStatus, setSelectedStatus] = useState("All Status");
   const [selectedType, setSelectedType] = useState("All Types");
   const [stats, setStats] = useState<any>(null);
   const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
   const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
   const [toast, setToast] = useState<{
      message: string;
      type: "success" | "error" | "warning";
   } | null>(null);

   const statusDropdownRef = useRef<HTMLDivElement>(null);
   const typeDropdownRef = useRef<HTMLDivElement>(null);

   // Close dropdowns when clicking outside
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            statusDropdownRef.current &&
            !statusDropdownRef.current.contains(event.target as Node)
         ) {
            setStatusDropdownOpen(false);
         }
         if (
            typeDropdownRef.current &&
            !typeDropdownRef.current.contains(event.target as Node)
         ) {
            setTypeDropdownOpen(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
         document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   const {
      data: payments = [],
      loading,
      fetch,
      page,
      limit,
      total,
      goToPage,
      setPageSize,
   } = useAdminList(adminPaymentsAPI.getAll);

   // Fetch stats on mount
   useEffect(() => {
      const fetchStats = async () => {
         try {
            const data = await adminPaymentsAPI.getStats();
            setStats(data);
         } catch (err) {
            console.error("Failed to fetch payment stats:", err);
         }
      };
      fetchStats();
   }, []);

   const handleStatusUpdate = async (id: string, newStatus: string) => {
      try {
         await adminPaymentsAPI.updateStatus(id, newStatus);
         setToast({ message: "Payment status updated!", type: "success" });
         fetch();
      } catch (err: any) {
         setToast({ message: err.message, type: "error" });
      }
   };

   const handleDeletePayment = async (id: string, transactionId: string) => {
      if (confirm(`Delete payment ${transactionId || id}?`)) {
         try {
            await adminPaymentsAPI.delete(id);
            setToast({ message: "Payment deleted!", type: "success" });
            fetch();
         } catch (err: any) {
            setToast({ message: err.message, type: "error" });
         }
      }
   };

   const filteredPayments = (payments || []).filter((payment: any) => {
      const matchesSearch =
         payment.transactionId
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
         payment.booking?.guestName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
         payment.booking?.user?.fullName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());
      const matchesStatus =
         selectedStatus === "All Status" || payment.status === selectedStatus;
      const matchesType =
         selectedType === "All Types" || payment.paymentType === selectedType;
      return matchesSearch && matchesStatus && matchesType;
   });

   const getStatusBadge = (status: string) => {
      const badges: Record<string, { bg: string; text: string; icon: any }> = {
         COMPLETED: {
            bg: "bg-green-100",
            text: "text-green-700",
            icon: CheckCircleIcon,
         },
         PENDING: {
            bg: "bg-yellow-100",
            text: "text-yellow-700",
            icon: ClockIcon,
         },
         FAILED: {
            bg: "bg-red-100",
            text: "text-red-700",
            icon: XCircleIcon,
         },
         REFUNDED: {
            bg: "bg-purple-100",
            text: "text-purple-700",
            icon: TrendingUpIcon,
         },
         CANCELLED: {
            bg: "bg-gray-100",
            text: "text-gray-700",
            icon: XCircleIcon,
         },
      };
      const badge = badges[status] || badges["PENDING"];
      const Icon = badge.icon;
      return (
         <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
            <Icon className="w-3 h-3" />
            {status}
         </span>
      );
   };

   const getPaymentTypeBadge = (type: string) => {
      const colors: Record<string, string> = {
         ATM: "bg-blue-100 text-blue-700",
         CLINIC: "bg-pink-100 text-pink-700",
         WALLET: "bg-purple-100 text-purple-700",
         CASH: "bg-green-100 text-green-700",
         BANK_TRANSFER: "bg-indigo-100 text-indigo-700",
      };
      return (
         <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
               colors[type] || "bg-gray-100 text-gray-700"
            }`}>
            {type}
         </span>
      );
   };

   const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("vi-VN", {
         style: "currency",
         currency: "VND",
      }).format(amount);
   };

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold text-gray-800">Payments</h1>
               <p className="text-gray-600 mt-1">Manage payment transactions</p>
            </div>
         </div>

         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center">
                     <CheckCircleIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                     <p className="text-xs text-gray-600 font-medium">
                        Completed
                     </p>
                     <p className="text-xl font-bold text-gray-800">
                        {stats?.completedPayments || 0}
                     </p>
                  </div>
               </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-4 border border-yellow-100">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 flex items-center justify-center">
                     <ClockIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                     <p className="text-xs text-gray-600 font-medium">
                        Pending
                     </p>
                     <p className="text-xl font-bold text-gray-800">
                        {stats?.pendingPayments || 0}
                     </p>
                  </div>
               </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 border border-red-100">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-400 to-rose-400 flex items-center justify-center">
                     <XCircleIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                     <p className="text-xs text-gray-600 font-medium">Failed</p>
                     <p className="text-xl font-bold text-gray-800">
                        {stats?.failedPayments || 0}
                     </p>
                  </div>
               </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                     <DollarSignIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                     <p className="text-xs text-gray-600 font-medium">
                        Total Payments
                     </p>
                     <p className="text-xl font-bold text-gray-800">
                        {stats?.totalPayments || 0}
                     </p>
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
            {/* Filters */}
            <div className="p-4 border-b border-pink-100 flex flex-wrap items-center gap-4">
               <div className="relative flex-1 min-w-[200px]">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                     type="text"
                     placeholder="Search by transaction ID, customer..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border-2 border-pink-100 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 text-sm transition-all duration-200 hover:border-pink-200"
                  />
               </div>

               {/* Custom Status Dropdown */}
               <div className="relative" ref={statusDropdownRef}>
                  <button
                     onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                     className="flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-xl bg-gradient-to-br from-white to-pink-50 border-2 border-pink-200 hover:border-pink-300 hover:shadow-lg focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 text-sm font-medium text-gray-700 transition-all duration-200 min-w-[150px]">
                     <span className="flex-1 text-left">{selectedStatus}</span>
                     <ChevronDownIcon
                        className={`w-4 h-4 text-pink-500 transition-transform duration-200 ${
                           statusDropdownOpen ? "rotate-180" : ""
                        }`}
                     />
                  </button>
                  {statusDropdownOpen && (
                     <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border-2 border-pink-200 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {[
                           "All Status",
                           "COMPLETED",
                           "PENDING",
                           "FAILED",
                           "REFUNDED",
                           "CANCELLED",
                        ].map((status) => (
                           <button
                              key={status}
                              onClick={() => {
                                 setSelectedStatus(status);
                                 setStatusDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                 selectedStatus === status
                                    ? "bg-pink-100 text-pink-700 font-semibold"
                                    : "text-gray-700 hover:bg-pink-50"
                              }`}>
                              {status === "COMPLETED" && "✓ "}
                              {status === "PENDING" && "⏱ "}
                              {status === "FAILED" && "✗ "}
                              {status === "REFUNDED" && "↩ "}
                              {status === "CANCELLED" && "⊘ "}
                              {status}
                           </button>
                        ))}
                     </div>
                  )}
               </div>

               {/* Custom Type Dropdown */}
               <div className="relative" ref={typeDropdownRef}>
                  <button
                     onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                     className="flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-xl bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 hover:border-purple-300 hover:shadow-lg focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 text-sm font-medium text-gray-700 transition-all duration-200 min-w-[150px]">
                     <span className="flex-1 text-left">{selectedType}</span>
                     <ChevronDownIcon
                        className={`w-4 h-4 text-purple-500 transition-transform duration-200 ${
                           typeDropdownOpen ? "rotate-180" : ""
                        }`}
                     />
                  </button>
                  {typeDropdownOpen && (
                     <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border-2 border-purple-200 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {[
                           { value: "All Types", icon: "" },
                           { value: "ATM", icon: "💳" },
                           { value: "CLINIC", icon: "🏥" },
                           { value: "WALLET", icon: "👛" },
                           { value: "CASH", icon: "💵" },
                           { value: "BANK_TRANSFER", icon: "🏦" },
                        ].map((type) => (
                           <button
                              key={type.value}
                              onClick={() => {
                                 setSelectedType(type.value);
                                 setTypeDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                 selectedType === type.value
                                    ? "bg-purple-100 text-purple-700 font-semibold"
                                    : "text-gray-700 hover:bg-purple-50"
                              }`}>
                              {type.icon && (
                                 <span className="mr-2">{type.icon}</span>
                              )}
                              {type.value}
                           </button>
                        ))}
                     </div>
                  )}
               </div>

               <button className="p-2.5 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 hover:border-pink-400 hover:shadow-lg transition-all duration-200">
                  <FilterIcon className="w-5 h-5 text-pink-500" />
               </button>
            </div>

            {loading ? (
               <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
               </div>
            ) : (
               <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead className="bg-pink-50/50">
                        <tr>
                           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Transaction ID
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Customer
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Amount
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Type
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Status
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Date
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Actions
                           </th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-pink-100">
                        {filteredPayments.map((payment: any) => (
                           <tr
                              key={payment.id}
                              className="hover:bg-pink-50/30 transition-colors">
                              <td className="px-6 py-4 text-sm">
                                 <div className="font-mono text-gray-800">
                                    {payment.transactionId || "N/A"}
                                 </div>
                                 <div className="text-xs text-gray-500">
                                    Booking: {payment.booking?.referenceNumber}
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                 <div className="font-medium text-gray-800">
                                    {payment.booking?.guestName ||
                                       payment.booking?.user?.fullName ||
                                       "Guest"}
                                 </div>
                                 <div className="text-xs text-gray-500">
                                    {payment.booking?.guestEmail ||
                                       payment.booking?.user?.email}
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                 <div className="font-semibold text-gray-800">
                                    {formatCurrency(Number(payment.amount))}
                                 </div>
                                 <div className="text-xs text-gray-500">
                                    {payment.currency}
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                 {getPaymentTypeBadge(payment.paymentType)}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                 {getStatusBadge(payment.status)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                 {new Date(
                                    payment.createdAt
                                 ).toLocaleDateString("vi-VN")}
                                 <div className="text-xs text-gray-500">
                                    {new Date(
                                       payment.createdAt
                                    ).toLocaleTimeString("vi-VN")}
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                 <div className="flex items-center gap-2">
                                    {payment.status === "PENDING" && (
                                       <>
                                          <button
                                             onClick={() =>
                                                handleStatusUpdate(
                                                   payment.id,
                                                   "COMPLETED"
                                                )
                                             }
                                             className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors">
                                             Complete
                                          </button>
                                          <button
                                             onClick={() =>
                                                handleStatusUpdate(
                                                   payment.id,
                                                   "FAILED"
                                                )
                                             }
                                             className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
                                             Fail
                                          </button>
                                       </>
                                    )}
                                    <button
                                       onClick={() =>
                                          handleDeletePayment(
                                             payment.id,
                                             payment.transactionId
                                          )
                                       }
                                       className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors">
                                       Delete
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}

            {/* Pagination */}
            {!loading && payments.length > 0 && (
               <div className="flex items-center justify-between p-4 border-t border-pink-100 bg-pink-50/30">
                  <div className="flex items-center gap-2">
                     <span className="text-sm text-gray-600">
                        Items per page:
                     </span>
                     <select
                        value={limit}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="px-3 py-1 rounded-lg border border-pink-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
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
                        className="px-4 py-2 rounded-lg bg-white border border-pink-200 text-gray-700 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium">
                        Previous
                     </button>
                     <div className="text-sm text-gray-600">
                        Page{" "}
                        <span className="font-semibold text-pink-600">
                           {page}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold">
                           {Math.ceil(total / limit)}
                        </span>
                     </div>
                     <button
                        onClick={() => goToPage(page + 1)}
                        disabled={page >= Math.ceil(total / limit)}
                        className="px-4 py-2 rounded-lg bg-white border border-pink-200 text-gray-700 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium">
                        Next
                     </button>
                  </div>

                  <div className="text-sm text-gray-600">
                     Showing {(page - 1) * limit + 1} to{" "}
                     {Math.min(page * limit, total)} of {total} payments
                  </div>
               </div>
            )}
         </div>

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

export default Payments;
