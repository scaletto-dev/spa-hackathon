/**
 * Upload API Adapter
 * Handles image uploads to Supabase Storage via backend
 */

const API_BASE_URL =
   import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const UPLOAD_API = `${API_BASE_URL}/api/v1/upload`;

export type ImageFolder = "blog" | "branches" | "profile" | "service";

interface UploadResponse {
   success: boolean;
   data?: {
      url: string;
      folder: string;
   };
   error?: string;
   message?: string;
}

/**
 * Upload image to Supabase Storage
 * @param file - File object from input
 * @param folder - Target folder (blog | branches | profile | service)
 */
export const uploadImage = async (
   file: File,
   folder: ImageFolder = "service"
): Promise<string> => {
   try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${UPLOAD_API}/image?folder=${folder}`, {
         method: "POST",
         body: formData,
         credentials: "include",
      });

      const result: UploadResponse = await response.json();

      if (!response.ok || !result.success) {
         throw new Error(result.message || "Upload failed");
      }

      if (!result.data?.url) {
         throw new Error("No URL returned from upload");
      }

      return result.data.url;
   } catch (error) {
      console.error("Upload error:", error);
      throw error instanceof Error ? error : new Error("Upload failed");
   }
};

export const uploadAPI = {
   uploadImage,
};
