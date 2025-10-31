import { useState, useEffect } from "react";
import {
   UserIcon,
   BellIcon,
   ShieldIcon,
   CreditCardIcon,
   GlobeIcon,
   Camera,
   SparklesIcon,
} from "lucide-react";
import { CustomDropdown } from "../components/CustomDropdown";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/useAuth";
import { adminProfileAPI } from "../../api/adapters/admin";
import { uploadAPI } from "../../api/adapters/upload";
import { toast } from "../../utils/toast";

interface ProfileData {
   fullName: string;
   email: string;
   phone: string;
   language: string;
   avatar?: string;
}

export function Settings() {
   const { t } = useTranslation("common");
   const { updateUser } = useAuth();
   const [activeTab, setActiveTab] = useState("profile");
   const [profileData, setProfileData] = useState<ProfileData>({
      fullName: "",
      email: "",
      phone: "",
      language: "vi",
      avatar: "",
   });
   const [passwordData, setPasswordData] = useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
   });
   const [loading, setLoading] = useState(false);
   const [uploading, setUploading] = useState(false);
   const [profileLoading, setProfileLoading] = useState(true);

   // Load profile data
   useEffect(() => {
      loadProfile();
   }, []);

   const loadProfile = async () => {
      try {
         setProfileLoading(true);
         const response = await adminProfileAPI.getProfile();
         console.log("📥 Profile API response:", response);

         // Extract data from response (might be wrapped in .data)
         const data = response.data || response;
         console.log("👤 Profile data:", data);

         setProfileData({
            fullName: data.fullName || "",
            email: data.email || "",
            phone: data.phone || "",
            language: data.language || "vi",
            avatar: data.avatar || "",
         });
      } catch (error: any) {
         console.error("Profile load error:", error);
         toast.error(error.message || "Không thể tải thông tin profile");
      } finally {
         setProfileLoading(false);
      }
   };

   const handleProfileChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
   ) => {
      const { name, value } = e.target;
      setProfileData((prev) => ({ ...prev, [name]: value }));
   };

   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setPasswordData((prev) => ({ ...prev, [name]: value }));
   };

   const handleAvatarUpload = async (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate
      if (!file.type.startsWith("image/")) {
         toast.error("Vui lòng chọn file ảnh hợp lệ");
         return;
      }

      if (file.size > 5 * 1024 * 1024) {
         toast.error("Kích thước file không được vượt quá 5MB");
         return;
      }

      try {
         setUploading(true);

         // Upload image to Supabase
         const imageUrl = await uploadAPI.uploadImage(file, "profile");
         console.log("📷 Uploaded image URL:", imageUrl);

         // Update state immediately for UI feedback
         setProfileData((prev) => ({ ...prev, avatar: imageUrl }));

         // Auto-save to backend
         await adminProfileAPI.updateProfile({
            avatar: imageUrl,
         });

         // Update user context to refresh header avatar
         console.log("🔄 Updating user context with avatar:", imageUrl);
         updateUser({ avatar: imageUrl });

         // Verify localStorage was updated
         const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
         console.log("💾 localStorage user_data after update:", userData);

         toast.success("Cập nhật avatar thành công!");

         // Reload profile to confirm
         await loadProfile();
      } catch (error: any) {
         console.error("Avatar upload error:", error);
         toast.error(error.message || "Upload ảnh thất bại");
      } finally {
         setUploading(false);
      }
   };

   const handleSaveProfile = async () => {
      try {
         setLoading(true);
         const updateData: any = {
            fullName: profileData.fullName,
            phone: profileData.phone,
            language: profileData.language,
         };
         if (profileData.avatar) {
            updateData.avatar = profileData.avatar;
         }
         await adminProfileAPI.updateProfile(updateData);
         toast.success("Cập nhật thông tin thành công!");
      } catch (error: any) {
         toast.error(error.message || "Có lỗi xảy ra");
      } finally {
         setLoading(false);
      }
   };

   const handleChangePassword = async () => {
      // Validation
      if (
         !passwordData.currentPassword ||
         !passwordData.newPassword ||
         !passwordData.confirmPassword
      ) {
         toast.error("Vui lòng điền đầy đủ thông tin");
         return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
         toast.error("Mật khẩu mới và xác nhận không khớp");
         return;
      }

      if (passwordData.newPassword.length < 8) {
         toast.error("Mật khẩu mới phải có ít nhất 8 ký tự");
         return;
      }

      try {
         setLoading(true);
         await adminProfileAPI.changePassword(passwordData);
         toast.success("Đổi mật khẩu thành công!");
         // Reset form
         setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
         });
      } catch (error: any) {
         toast.error(error.message || "Có lỗi xảy ra");
      } finally {
         setLoading(false);
      }
   };

   const tabs = [
      {
         id: "profile",
         label: t("settings.profile"),
         icon: UserIcon,
      },
      {
         id: "notifications",
         label: t("settings.notifications"),
         icon: BellIcon,
      },
      {
         id: "security",
         label: t("settings.security"),
         icon: ShieldIcon,
      },
      {
         id: "billing",
         label: t("settings.billing"),
         icon: CreditCardIcon,
      },
      {
         id: "integrations",
         label: t("settings.integrations"),
         icon: GlobeIcon,
      },
   ];

   return (
      <div className="space-y-6">
         <div>
            <h1 className="text-3xl font-bold text-gray-800">
               {t("settings.title")}
            </h1>
            <p className="text-gray-600 mt-1">{t("settings.subtitle")}</p>
         </div>
         <div className="flex gap-6">
            <div className="w-64 flex-shrink-0">
               <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm p-2">
                  {tabs.map((tab) => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                           activeTab === tab.id
                              ? "bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600 shadow-sm"
                              : "text-gray-600 hover:bg-pink-50"
                        }`}>
                        <tab.icon
                           className={`w-5 h-5 ${
                              activeTab === tab.id ? "text-pink-500" : ""
                           }`}
                        />
                        <span className="font-medium text-sm">{tab.label}</span>
                     </button>
                  ))}
               </div>
            </div>
            <div className="flex-1">
               <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm p-6">
                  {activeTab === "profile" && (
                     <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                           {t("settings.profileSettings")}
                        </h2>

                        {profileLoading ? (
                           <div className="flex items-center justify-center py-12">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                           </div>
                        ) : (
                           <>
                              {/* Avatar Upload */}
                              <div className="flex items-center gap-6">
                                 <div className="relative">
                                    <img
                                       src={
                                          profileData.avatar ||
                                          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                                       }
                                       alt="Profile"
                                       className="w-24 h-24 rounded-full border-4 border-pink-200 object-cover"
                                    />
                                    {uploading && (
                                       <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                       </div>
                                    )}
                                 </div>
                                 <div>
                                    <label className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg text-sm font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm cursor-pointer inline-flex items-center gap-2">
                                       <Camera className="w-4 h-4" />
                                       {uploading
                                          ? "Đang upload..."
                                          : t("settings.changePhoto")}
                                       <input
                                          type="file"
                                          className="hidden"
                                          accept="image/*"
                                          onChange={handleAvatarUpload}
                                          disabled={uploading}
                                       />
                                    </label>
                                    <p className="text-xs text-gray-500 mt-2">
                                       JPG, PNG hoặc WebP. Tối đa 5MB.
                                    </p>
                                 </div>
                              </div>

                              {/* Full Name */}
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Họ và tên
                                 </label>
                                 <input
                                    type="text"
                                    name="fullName"
                                    value={profileData.fullName}
                                    onChange={handleProfileChange}
                                    className="w-full px-4 py-2 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/30"
                                 />
                              </div>

                              {/* Email (readonly) */}
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t("settings.email")}
                                 </label>
                                 <input
                                    type="email"
                                    value={profileData.email}
                                    readOnly
                                    className="w-full px-4 py-2 rounded-lg border border-pink-100 bg-gray-100 text-gray-600 cursor-not-allowed"
                                 />
                                 <p className="text-xs text-gray-500 mt-1">
                                    Email không thể thay đổi
                                 </p>
                              </div>

                              {/* Phone */}
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số điện thoại
                                 </label>
                                 <input
                                    type="tel"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleProfileChange}
                                    className="w-full px-4 py-2 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/30"
                                 />
                              </div>

                              {/* Language */}
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngôn ngữ
                                 </label>
                                 <CustomDropdown
                                    value={profileData.language}
                                    onChange={(value) =>
                                       setProfileData((prev) => ({
                                          ...prev,
                                          language: value,
                                       }))
                                    }
                                    color="blue"
                                    options={[
                                       { value: "vi", label: "Tiếng Việt", icon: "🇻🇳" },
                                       { value: "en", label: "English", icon: "🇬🇧" },
                                    ]}
                                 />
                              </div>

                              {/* Save Button */}
                              <button
                                 onClick={handleSaveProfile}
                                 disabled={loading}
                                 className="px-6 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm disabled:opacity-50">
                                 {loading
                                    ? "Đang lưu..."
                                    : t("settings.saveChanges")}
                              </button>
                           </>
                        )}
                     </div>
                  )}
                  {activeTab === "notifications" && (
                     <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                           {t("settings.notificationPreferences")}
                        </h2>
                        <div className="space-y-4">
                           <div className="flex items-center justify-between p-4 bg-pink-50/50 rounded-xl">
                              <div>
                                 <h3 className="font-medium text-gray-800">
                                    {t("settings.emailNotifications")}
                                 </h3>
                                 <p className="text-sm text-gray-600">
                                    {t("settings.emailNotificationsDesc")}
                                 </p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                 <input
                                    type="checkbox"
                                    defaultChecked
                                    className="sr-only peer"
                                 />
                                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-400 peer-checked:to-purple-400" />
                              </label>
                           </div>
                           <div className="flex items-center justify-between p-4 bg-pink-50/50 rounded-xl">
                              <div>
                                 <h3 className="font-medium text-gray-800">
                                    {t("settings.pushNotifications")}
                                 </h3>
                                 <p className="text-sm text-gray-600">
                                    {t("settings.pushNotificationsDesc")}
                                 </p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                 <input
                                    type="checkbox"
                                    defaultChecked
                                    className="sr-only peer"
                                 />
                                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-400 peer-checked:to-purple-400" />
                              </label>
                           </div>
                           <div className="flex items-center justify-between p-4 bg-pink-50/50 rounded-xl">
                              <div>
                                 <h3 className="font-medium text-gray-800">
                                    {t("settings.smsNotifications")}
                                 </h3>
                                 <p className="text-sm text-gray-600">
                                    {t("settings.smsNotificationsDesc")}
                                 </p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                 <input
                                    type="checkbox"
                                    className="sr-only peer"
                                 />
                                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-400 peer-checked:to-purple-400" />
                              </label>
                           </div>
                        </div>
                     </div>
                  )}
                  {activeTab === "security" && (
                     <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                           {t("settings.securitySettings")}
                        </h2>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t("settings.currentPassword")}
                           </label>
                           <input
                              type="password"
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              placeholder={t(
                                 "settings.currentPasswordPlaceholder"
                              )}
                              className="w-full px-4 py-2 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/30"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t("settings.newPassword")}
                           </label>
                           <input
                              type="password"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              placeholder={t("settings.newPasswordPlaceholder")}
                              className="w-full px-4 py-2 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/30"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t("settings.confirmNewPassword")}
                           </label>
                           <input
                              type="password"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              placeholder={t(
                                 "settings.confirmNewPasswordPlaceholder"
                              )}
                              className="w-full px-4 py-2 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/30"
                           />
                        </div>
                        <button
                           onClick={handleChangePassword}
                           disabled={loading}
                           className="px-6 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                           {loading
                              ? "Đang xử lý..."
                              : t("settings.updatePassword")}
                        </button>
                        <div className="border-t border-pink-100 pt-6">
                           <h3 className="font-medium text-gray-800 mb-4">
                              {t("settings.twoFactorAuth")}
                           </h3>
                           <div className="flex items-center justify-between p-4 bg-pink-50/50 rounded-xl">
                              <div>
                                 <p className="text-sm text-gray-700">
                                    {t("settings.twoFactorAuthDesc")}
                                 </p>
                              </div>
                              <button className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg text-sm font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm">
                                 {t("settings.enable")}
                              </button>
                           </div>
                        </div>
                     </div>
                  )}
                  {activeTab === "billing" && (
                     <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                           {t("settings.billingSubscription")}
                        </h2>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                           <div className="flex items-center justify-between mb-4">
                              <div>
                                 <h3 className="text-lg font-semibold text-gray-800">
                                    {t("settings.premiumPlan")}
                                 </h3>
                                 <p className="text-sm text-gray-600">
                                    {t("settings.billedMonthly")}
                                 </p>
                              </div>
                              <div className="text-right">
                                 <p className="text-3xl font-bold text-gray-800">
                                    $99
                                 </p>
                                 <p className="text-sm text-gray-600">
                                    {t("settings.perMonth")}
                                 </p>
                              </div>
                           </div>
                           <button className="w-full py-2 bg-white rounded-lg text-sm font-medium text-pink-600 hover:bg-pink-50 transition-colors">
                              {t("settings.manageSubscription")}
                           </button>
                        </div>
                        <div>
                           <h3 className="font-medium text-gray-800 mb-3">
                              {t("settings.paymentMethod")}
                           </h3>
                           <div className="flex items-center gap-4 p-4 bg-pink-50/50 rounded-xl">
                              <CreditCardIcon className="w-8 h-8 text-pink-400" />
                              <div className="flex-1">
                                 <p className="font-medium text-gray-800">
                                    •••• •••• •••• 4242
                                 </p>
                                 <p className="text-sm text-gray-600">
                                    {t("settings.expiresDate")} 12/25
                                 </p>
                              </div>
                              <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                                 {t("settings.update")}
                              </button>
                           </div>
                        </div>
                     </div>
                  )}
                  {activeTab === "integrations" && (
                     <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                           {t("settings.integrationsTitle")}
                        </h2>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                           <div className="flex items-center gap-2">
                              <SparklesIcon className="w-5 h-5 text-purple-600" />
                              <p className="text-sm text-gray-700">
                                 {t("settings.integrationsDesc")}
                              </p>
                           </div>
                        </div>
                        <div className="space-y-3">
                           <div className="flex items-center justify-between p-4 bg-pink-50/50 rounded-xl">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
                                    <GlobeIcon className="w-5 h-5 text-white" />
                                 </div>
                                 <div>
                                    <h3 className="font-medium text-gray-800">
                                       {t("settings.googleCalendar")}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                       {t("settings.syncAppointments")}
                                    </p>
                                 </div>
                              </div>
                              <button className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg text-sm font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm">
                                 {t("settings.connect")}
                              </button>
                           </div>
                           <div className="flex items-center justify-between p-4 bg-pink-50/50 rounded-xl">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center">
                                    <CreditCardIcon className="w-5 h-5 text-white" />
                                 </div>
                                 <div>
                                    <h3 className="font-medium text-gray-800">
                                       {t("settings.stripe")}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                       {t("settings.paymentProcessing")}
                                    </p>
                                 </div>
                              </div>
                              <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                 {t("settings.connected")}
                              </span>
                           </div>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
export default Settings;
