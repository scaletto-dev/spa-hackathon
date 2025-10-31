import { useState } from "react";
import {
   CalendarIcon,
   CheckCircleIcon,
   XCircleIcon,
   PlusIcon,
} from "lucide-react";
import { NewBookingModal } from "../components/modals/NewBookingModal";
import { Toast } from "../components/Toast";
import { CustomDropdown } from "../components/CustomDropdown";
import { PaginationControls } from "../components/PaginationControls";
import { adminAppointmentsAPI } from "../../api/adapters/admin";
import { useAdminList } from "../../hooks/useAdmin";

export function Appointments() {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedStatus, setSelectedStatus] = useState("All Status");
   const [toast, setToast] = useState<{
      message: string;
      type: "success" | "error" | "warning";
   } | null>(null);

   // Pass status and search filters to API (backend will filter)
   const statusFilter = selectedStatus === "All Status" ? undefined : selectedStatus.toUpperCase();
   const searchFilter = searchQuery.trim() || undefined;
   const {
      data: appointments = [],
      loading,
      fetch,
      page,
      limit,
      total,
      goToPage,
      setPageSize,
   } = useAdminList(
      adminAppointmentsAPI.getAll,
      [statusFilter, searchFilter]
   );

   const handleBookingSuccess = () => {
      setToast({ message: "Booking created successfully!", type: "success" });
      fetch();
   };

   const handleDeleteAppointment = async (id: string, guestName: string) => {
      if (confirm(`Cancel appointment for ${guestName}?`)) {
         try {
            await adminAppointmentsAPI.delete(id);
            setToast({ message: "Appointment cancelled!", type: "success" });
            fetch();
         } catch (err: any) {
            setToast({ message: err.message, type: "error" });
         }
      }
   };

   const handleStatusUpdate = async (id: string, newStatus: string) => {
      try {
         await adminAppointmentsAPI.updateStatus(id, newStatus);
         setToast({ message: "Status updated!", type: "success" });
         fetch();
      } catch (err: any) {
         setToast({ message: err.message, type: "error" });
      }
   };

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold text-gray-800">
                  Appointments
               </h1>
               <p className="text-gray-600 mt-1">Manage all clinic bookings</p>
            </div>
            <button
               onClick={() => setIsModalOpen(true)}
               className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm flex items-center gap-2">
               <PlusIcon className="w-5 h-5" />
               New Booking
            </button>
         </div>

         <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4 text-white" />
               </div>
               <p className="text-sm text-gray-700">
                  <span className="font-semibold">Total Appointments:</span>{" "}
                  {total || 0} bookings
               </p>
            </div>
         </div>

         <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-pink-100 flex items-center gap-4">
               <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
               />
               <CustomDropdown
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  color="pink"
                  options={[
                     { value: "All Status", label: "All Status" },
                     { value: "CONFIRMED", label: "CONFIRMED", icon: "✓" },
                     { value: "PENDING", label: "PENDING", icon: "⏳" },
                     { value: "COMPLETED", label: "COMPLETED", icon: "✅" },
                     { value: "CANCELLED", label: "CANCELLED", icon: "❌" },
                  ]}
               />
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
                              Name
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Contact
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Date & Time
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
                        {appointments.map((appointment: any) => (
                           <tr
                              key={appointment.id}
                              className="hover:bg-pink-50/30 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                                       {appointment.guestName?.charAt(0) || "?"}
                                    </div>
                                    <span className="font-medium text-gray-800">
                                       {appointment.guestName}
                                    </span>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="text-sm">
                                    <div className="text-gray-700">
                                       {appointment.guestEmail}
                                    </div>
                                    <div className="text-gray-500">
                                       {appointment.guestPhone}
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                                    <div>
                                       <div className="text-sm font-medium text-gray-800">
                                          {new Date(
                                             appointment.appointmentDate
                                          ).toLocaleDateString()}
                                       </div>
                                       <div className="text-xs text-gray-500">
                                          {appointment.appointmentTime}
                                       </div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                       appointment.status === "CONFIRMED"
                                          ? "bg-green-100 text-green-700"
                                          : appointment.status === "PENDING"
                                          ? "bg-yellow-100 text-yellow-700"
                                          : appointment.status === "COMPLETED"
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-red-100 text-red-700"
                                    }`}>
                                    {appointment.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-2">
                                    <button
                                       onClick={() =>
                                          handleStatusUpdate(
                                             appointment.id,
                                             "COMPLETED"
                                          )
                                       }
                                       className="p-2 rounded-lg hover:bg-pink-100 transition-colors">
                                       <CheckCircleIcon className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button
                                       onClick={() =>
                                          handleDeleteAppointment(
                                             appointment.id,
                                             appointment.guestName
                                          )
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
            )}
         </div>

         {/* Pagination - Outside overflow-hidden container */}
         {!loading && appointments.length > 0 && (
            <div className="relative isolate bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm overflow-visible" style={{ zIndex: 9999 }}>
               <PaginationControls
                  page={page}
                  limit={limit}
                  total={total}
                  goToPage={goToPage}
                  setPageSize={setPageSize}
                  color="pink"
               />
            </div>
         )}

         <NewBookingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleBookingSuccess}
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

export default Appointments;
