import React, { useState, useEffect } from "react";
import { XIcon } from "lucide-react";
import { toast } from "../../../utils/toast";
import { Input, FormField } from "../../../components/ui";
import { adminCustomersAPI } from "../../../api/adapters/admin";

interface CustomerModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSuccess?: () => void;
   customer?: any;
   mode?: "create" | "edit";
}

export function CustomerModal({
   isOpen,
   onClose,
   onSuccess,
   customer,
   mode = "create",
}: CustomerModalProps) {
   const [loading, setLoading] = useState(false);
   const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      phone: "",
      language: "en",
   });

   // Update form data when customer prop changes (for edit mode)
   useEffect(() => {
      if (customer && mode === "edit") {
         setFormData({
            fullName: customer.fullName || "",
            email: customer.email || "",
            phone: customer.phone || "",
            language: customer.language || "en",
         });
      } else {
         // Reset form for create mode
         setFormData({
            fullName: "",
            email: "",
            phone: "",
            language: "en",
         });
      }
   }, [customer, mode, isOpen]);

   const handleChange = (
      e: React.ChangeEvent<
         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
   ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleSubmit = async () => {
      // Validation
      if (
         !formData.fullName.trim() ||
         !formData.email.trim() ||
         !formData.phone.trim()
      ) {
         toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
         return;
      }

      // Email validation
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
         toast.error("Email không hợp lệ");
         return;
      }

      try {
         setLoading(true);
         if (mode === "create") {
            await adminCustomersAPI.create(formData);
            toast.success("Khách hàng đã được thêm thành công!");
         } else {
            await adminCustomersAPI.update(customer.id, formData);
            toast.success("Khách hàng đã được cập nhật thành công!");
         }

         // Reset form
         setFormData({
            fullName: "",
            email: "",
            phone: "",
            language: "en",
         });

         // Call success callback if provided
         onSuccess?.();

         onClose();
      } catch (error: any) {
         toast.error(error.message || "Có lỗi xảy ra");
      } finally {
         setLoading(false);
      }
   };

   if (!isOpen) return null;
   return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
         <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-6 rounded-t-3xl flex items-center justify-between flex-shrink-0">
               <h2 className="text-xl font-bold text-white">
                  {mode === "create"
                     ? "Thêm khách hàng mới"
                     : "Cập nhật khách hàng"}
               </h2>
               <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors">
                  <XIcon className="w-6 h-6 text-white" />
               </button>
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto flex-1 p-6 space-y-4">
               <FormField label="Họ và tên" name="fullName" required>
                  <Input
                     type="text"
                     name="fullName"
                     value={formData.fullName}
                     onChange={handleChange}
                     placeholder="Nhập tên khách hàng"
                  />
               </FormField>

               <FormField label="Địa chỉ Email" name="email" required>
                  <Input
                     type="email"
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     placeholder="email@example.com"
                  />
               </FormField>

               <FormField label="Số điện thoại" name="phone" required>
                  <Input
                     type="tel"
                     name="phone"
                     value={formData.phone}
                     onChange={handleChange}
                     placeholder="0912 345 678"
                  />
               </FormField>

               <FormField label="Ngôn ngữ" name="language">
                  <select
                     name="language"
                     value={formData.language}
                     onChange={handleChange}
                     className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300">
                     <option value="en">English</option>
                     <option value="vi">Tiếng Việt</option>
                     <option value="es">Español</option>
                  </select>
               </FormField>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 p-6 border-t border-pink-100 rounded-b-3xl flex gap-3">
               <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-lg border border-pink-200 text-gray-700 hover:bg-pink-50 transition-colors">
                  Hủy
               </button>
               <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm disabled:opacity-50">
                  {loading
                     ? "Đang xử lý..."
                     : mode === "create"
                     ? "Thêm khách hàng"
                     : "Cập nhật"}
               </button>
            </div>
         </div>
      </div>
   );
}
