import { useState, useEffect } from "react";
import { XIcon } from "lucide-react";
import { toast } from "../../../utils/toast";
import { Input, Textarea, FormField } from "../../../components/ui";
import { adminBranchesAPI } from "../../../api/adapters/admin";

interface BranchModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSuccess?: () => void;
   branch?: any;
   mode?: "create" | "edit";
}

export function BranchModal({
   isOpen,
   onClose,
   onSuccess,
   branch,
   mode = "create",
}: BranchModalProps) {
   const [loading, setLoading] = useState(false);
   const [formData, setFormData] = useState({
      name: "",
      slug: "",
      address: "",
      phone: "",
      email: "",
      latitude: "0",
      longitude: "0",
   });

   // Update form data when branch changes or modal opens
   useEffect(() => {
      if (mode === "edit" && branch) {
         setFormData({
            name: branch.name || "",
            slug: branch.slug || "",
            address: branch.address || "",
            phone: branch.phone || "",
            email: branch.email || "",
            latitude: branch.latitude?.toString() || "0",
            longitude: branch.longitude?.toString() || "0",
         });
      } else if (mode === "create") {
         setFormData({
            name: "",
            slug: "",
            address: "",
            phone: "",
            email: "",
            latitude: "0",
            longitude: "0",
         });
      }
   }, [branch, mode, isOpen]);

   const handleChange = (
      e: React.ChangeEvent<
         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
   ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleSubmit = async () => {
      if (
         !formData.name.trim() ||
         !formData.address.trim() ||
         !formData.phone.trim()
      ) {
         toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
         return;
      }

      try {
         setLoading(true);
         const slug =
            formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-");

         const payload = {
            ...formData,
            slug,
            operatingHours: {
               monday: "9:00-18:00",
               tuesday: "9:00-18:00",
               wednesday: "9:00-18:00",
               thursday: "9:00-18:00",
               friday: "9:00-18:00",
               saturday: "9:00-18:00",
               sunday: "Closed",
            },
         };

         if (mode === "create") {
            await adminBranchesAPI.create(payload);
            toast.success("Chi nhánh đã được tạo thành công!");
         } else {
            await adminBranchesAPI.update(branch.id, payload);
            toast.success("Chi nhánh đã được cập nhật thành công!");
         }

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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
         <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-6 rounded-t-3xl flex items-center justify-between">
               <h2 className="text-xl font-bold text-white">
                  {mode === "create"
                     ? "Thêm chi nhánh mới"
                     : "Cập nhật chi nhánh"}
               </h2>
               <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors">
                  <XIcon className="w-6 h-6 text-white" />
               </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-4">
               <FormField label="Tên chi nhánh" name="name" required>
                  <Input
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                     placeholder="Nhập tên chi nhánh"
                  />
               </FormField>

               <FormField label="Địa chỉ" name="address" required>
                  <Textarea
                     name="address"
                     value={formData.address}
                     onChange={handleChange}
                     rows={2}
                     placeholder="Nhập địa chỉ chi nhánh"
                  />
               </FormField>

               <div className="grid grid-cols-2 gap-4">
                  <FormField label="Số điện thoại" name="phone" required>
                     <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0912 345 678"
                     />
                  </FormField>

                  <FormField label="Email" name="email">
                     <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="branch@example.com"
                     />
                  </FormField>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <FormField label="Latitude" name="latitude">
                     <Input
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        placeholder="10.762622"
                     />
                  </FormField>

                  <FormField label="Longitude" name="longitude">
                     <Input
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        placeholder="106.660172"
                     />
                  </FormField>
               </div>

               <FormField label="URL Slug" name="slug">
                  <Input
                     name="slug"
                     value={formData.slug}
                     onChange={handleChange}
                     placeholder="Để trống để auto-generate"
                  />
               </FormField>
            </div>

            <div className="p-6 border-t border-pink-100 flex gap-3">
               <button
                  onClick={onClose}
                  disabled={loading}
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
                     ? "Tạo chi nhánh"
                     : "Cập nhật"}
               </button>
            </div>
         </div>
      </div>
   );
}
