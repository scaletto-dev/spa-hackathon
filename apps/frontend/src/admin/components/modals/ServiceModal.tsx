import { useState, useEffect } from "react";
import { XIcon, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "../../../utils/toast";
import { Input, Textarea, FormField } from "../../../components/ui";
import { adminServicesAPI } from "../../../api/adapters/admin";
import { uploadAPI } from "../../../api/adapters/upload";

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
   const [uploading, setUploading] = useState(false);
   const [images, setImages] = useState<string[]>([]);
   const [formData, setFormData] = useState({
      name: "",
      slug: "",
      description: "",
      excerpt: "",
      duration: 60,
      price: "",
      categoryId: "general",
   });

   // Update form data when service changes or modal opens
   useEffect(() => {
      if (mode === "edit" && service) {
         setFormData({
            name: service.name || "",
            slug: service.slug || "",
            description: service.description || "",
            excerpt: service.excerpt || "",
            duration: service.duration || 60,
            price: service.price?.toString() || "",
            categoryId: service.categoryId || "general",
         });
         setImages(service.images || []);
      } else if (mode === "create") {
         setFormData({
            name: "",
            slug: "",
            description: "",
            excerpt: "",
            duration: 60,
            price: "",
            categoryId: "general",
         });
         setImages([]);
      }
   }, [service, mode, isOpen]);

   const handleChange = (
      e: React.ChangeEvent<
         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
   ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
         toast.error("Vui lòng chọn file ảnh hợp lệ");
         return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
         toast.error("Kích thước file không được vượt quá 5MB");
         return;
      }

      try {
         setUploading(true);

         // Upload to Supabase
         const imageUrl = await uploadAPI.uploadImage(file, "service");

         // Add to images array
         setImages((prev) => [...prev, imageUrl]);
         toast.success("Upload ảnh thành công!");
      } catch (error: any) {
         toast.error(error.message || "Upload ảnh thất bại");
      } finally {
         setUploading(false);
      }
   };

   const handleRemoveImage = (index: number) => {
      setImages((prev) => prev.filter((_, i) => i !== index));
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
            images: images,
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
               {/* Image Upload */}
               <FormField label="Hình ảnh dịch vụ" name="images">
                  <div className="space-y-3">
                     {/* Preview uploaded images */}
                     {images.length > 0 && (
                        <div className="grid grid-cols-2 gap-3">
                           {images.map((img, index) => (
                              <div
                                 key={index}
                                 className="relative h-32 rounded-xl overflow-hidden border-2 border-pink-200 group">
                                 <img
                                    src={img}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                 />
                                 <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100">
                                    <XIcon className="w-3 h-3" />
                                 </button>
                              </div>
                           ))}
                        </div>
                     )}

                     {/* Upload button */}
                     <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-pink-300 rounded-xl cursor-pointer hover:border-pink-400 hover:bg-pink-50/50 transition-all">
                        <div className="flex flex-col items-center justify-center">
                           {uploading ? (
                              <>
                                 <Upload className="w-8 h-8 mb-2 text-pink-400 animate-pulse" />
                                 <p className="text-sm text-pink-600 font-medium">
                                    Đang upload...
                                 </p>
                              </>
                           ) : (
                              <>
                                 <ImageIcon className="w-8 h-8 mb-2 text-pink-400" />
                                 <p className="text-sm text-gray-600">
                                    <span className="font-semibold text-pink-500">
                                       Click để thêm ảnh
                                    </span>
                                 </p>
                                 <p className="text-xs text-gray-500 mt-1">
                                    PNG, JPG, WebP (MAX. 5MB)
                                 </p>
                              </>
                           )}
                        </div>
                        <input
                           type="file"
                           className="hidden"
                           accept="image/*"
                           onChange={handleImageUpload}
                           disabled={uploading}
                        />
                     </label>
                  </div>
               </FormField>

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
