import { useState } from "react";
import { XIcon } from "lucide-react";
import { toast } from "../../../utils/toast";
import { Input, Textarea, FormField } from "../../../components/ui";
import { adminServicesAPI } from "../../../api/adapters/admin";

interface ServiceModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSuccess?: () => void;
   service?: any;
   mode?: "create" | "edit";
}

export function ServiceModal({
   isOpen,
   onClose,
   onSuccess,
   service,
   mode = "create",
}: ServiceModalProps) {
   const [loading, setLoading] = useState(false);
   const [formData, setFormData] = useState({
      name: service?.name || "",
      slug: service?.slug || "",
      description: service?.description || "",
      excerpt: service?.excerpt || "",
      duration: service?.duration || 60,
      price: service?.price || "",
      categoryId: service?.categoryId || "general",
   });

   const handleChange = (
      e: React.ChangeEvent<
         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
   ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleSubmit = async () => {
      if (!formData.name.trim() || !formData.description.trim()) {
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
            duration: Number(formData.duration),
         };

         if (mode === "create") {
            await adminServicesAPI.create(payload);
            toast.success("Dịch vụ đã được tạo thành công!");
         } else {
            await adminServicesAPI.update(service.id, payload);
            toast.success("Dịch vụ đã được cập nhật thành công!");
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
                  {mode === "create" ? "Thêm dịch vụ mới" : "Cập nhật dịch vụ"}
               </h2>
               <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors">
                  <XIcon className="w-6 h-6 text-white" />
               </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-4">
               <FormField label="Tên dịch vụ" name="name" required>
                  <Input
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                     placeholder="Nhập tên dịch vụ"
                  />
               </FormField>

               <FormField label="Mô tả ngắn" name="excerpt">
                  <Input
                     name="excerpt"
                     value={formData.excerpt}
                     onChange={handleChange}
                     placeholder="Mô tả ngắn về dịch vụ"
                  />
               </FormField>

               <FormField label="Mô tả chi tiết" name="description" required>
                  <Textarea
                     name="description"
                     value={formData.description}
                     onChange={handleChange}
                     rows={4}
                     placeholder="Mô tả chi tiết về dịch vụ"
                  />
               </FormField>

               <div className="grid grid-cols-2 gap-4">
                  <FormField label="Thời gian (phút)" name="duration" required>
                     <Input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="60"
                     />
                  </FormField>

                  <FormField label="Giá" name="price" required>
                     <Input
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="100000"
                     />
                  </FormField>
               </div>

               <FormField label="Danh mục" name="categoryId">
                  <select
                     name="categoryId"
                     value={formData.categoryId}
                     onChange={handleChange}
                     className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300">
                     <option value="general">General</option>
                     <option value="facial">Facial Treatment</option>
                     <option value="body">Body Treatment</option>
                     <option value="massage">Massage</option>
                  </select>
               </FormField>

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
                     ? "Tạo dịch vụ"
                     : "Cập nhật"}
               </button>
            </div>
         </div>
      </div>
   );
}
