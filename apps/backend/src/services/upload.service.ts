import { supabase, STORAGE_BUCKET } from "../config/supabase";
import { v4 as uuidv4 } from "uuid";
import path from "path";

/**
 * Image upload folders in Supabase Storage
 */
export enum ImageFolder {
   BLOG = "blog",
   BRANCHES = "branches",
   PROFILE = "profile",
   SERVICE = "service",
}

/**
 * Upload Service
 * Handles file uploads to Supabase Storage
 */
class UploadService {
   private readonly allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
   ];
   private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

   /**
    * Upload image to Supabase Storage
    * @param file - Multer file object
    * @param folder - Target folder (blog, branches, profile, service)
    */
   async uploadImage(
      file: {
         buffer: Buffer;
         mimetype: string;
         size: number;
         originalname: string;
      },
      folder: ImageFolder = ImageFolder.SERVICE
   ): Promise<string> {
      if (!supabase) {
         throw new Error("Supabase client not configured");
      }

      // Validate file type
      if (!this.allowedMimeTypes.includes(file.mimetype)) {
         throw new Error(
            "Invalid file type. Only JPEG, PNG, and WebP are allowed."
         );
      }

      // Validate file size
      if (file.size > this.maxFileSize) {
         throw new Error("File size exceeds 5MB limit.");
      }

      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const uniqueFilename = `${uuidv4()}${fileExtension}`;
      const filePath = `${folder}/${uniqueFilename}`;

      console.log(
         `📤 Uploading to bucket: ${STORAGE_BUCKET}, path: ${filePath}`
      );

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
         .from(STORAGE_BUCKET)
         .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            cacheControl: "3600",
            upsert: false,
         });

      if (error) {
         console.error("❌ Supabase upload error details:", {
            message: error.message,
            statusCode: (error as any).statusCode,
            bucket: STORAGE_BUCKET,
            path: filePath,
         });
         throw new Error(
            `Failed to upload image: ${error.message}. Make sure the '${STORAGE_BUCKET}' bucket exists and has proper policies.`
         );
      }

      // Get public URL
      const {
         data: { publicUrl },
      } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

      console.log(`✅ Image uploaded successfully: ${publicUrl}`);

      return publicUrl;
   }

   /**
    * Delete image from Supabase Storage
    */
   async deleteImage(imageUrl: string): Promise<void> {
      if (!supabase) {
         throw new Error("Supabase client not configured");
      }

      try {
         // Extract file path from URL
         // Example URL: https://xxx.supabase.co/storage/v1/object/public/images/service/uuid.jpg
         const urlParts = imageUrl.split("/public/images/");
         if (urlParts.length !== 2 || !urlParts[1]) {
            throw new Error("Invalid image URL format");
         }
         const filePath: string = urlParts[1];

         const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([filePath]);

         if (error) {
            throw new Error(`Failed to delete image: ${error.message}`);
         }

         console.log(`✅ Image deleted successfully: ${filePath}`);
      } catch (error) {
         console.error("Error deleting image:", error);
         throw error;
      }
   }
}

const uploadService = new UploadService();
export { uploadService };
export default uploadService;
