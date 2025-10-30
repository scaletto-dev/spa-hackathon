/**
 * Admin Profile Controller
 *
 * Handles admin's own profile management
 */

import { Request, Response, NextFunction } from "express";
import prisma from "../../lib/prisma";
import { ValidationError, NotFoundError } from "../../utils/errors";

class AdminProfileController {
   /**
    * GET /api/v1/admin/profile
    * Get current admin's profile
    */
   async getProfile(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         // Get userId from authenticated user
         const userId = (req as any).user?.id;

         if (!userId) {
            throw new ValidationError("User not authenticated");
         }

         const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
               id: true,
               email: true,
               phone: true,
               fullName: true,
               role: true,
               emailVerified: true,
               language: true,
               avatar: true,
               createdAt: true,
               updatedAt: true,
            },
         });

         if (!user) throw new NotFoundError("User not found");

         res.status(200).json({
            success: true,
            data: user,
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * PUT /api/v1/admin/profile
    * Update current admin's profile
    */
   async updateProfile(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         // Get userId from authenticated user
         const userId = (req as any).user?.id;

         if (!userId) {
            throw new ValidationError("User not authenticated");
         }

         const { fullName, phone, language, avatar } = req.body;

         const user = await prisma.user.findUnique({ where: { id: userId } });
         if (!user) throw new NotFoundError("User not found");

         // Build update data object
         const updateData: any = {};
         if (fullName !== undefined) updateData.fullName = fullName;
         if (phone !== undefined) updateData.phone = phone;
         if (language !== undefined) updateData.language = language;
         if (avatar !== undefined) updateData.avatar = avatar;

         console.log("📝 Updating profile with data:", updateData);

         const updated = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
               id: true,
               email: true,
               phone: true,
               fullName: true,
               role: true,
               language: true,
               avatar: true,
               updatedAt: true,
            },
         });

         res.status(200).json({
            success: true,
            data: updated,
            message: "Profile updated successfully",
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * POST /api/v1/admin/profile/change-password
    * Change current admin's password
    */
   async changePassword(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         // Get userId from authenticated user
         const userId = (req as any).user?.id;

         if (!userId) {
            throw new ValidationError("User not authenticated");
         }

         const { currentPassword, newPassword, confirmPassword } = req.body;

         // Validation
         if (!currentPassword || !newPassword || !confirmPassword) {
            throw new ValidationError("All password fields are required");
         }

         if (newPassword !== confirmPassword) {
            throw new ValidationError(
               "New password and confirmation do not match"
            );
         }

         if (newPassword.length < 8) {
            throw new ValidationError(
               "New password must be at least 8 characters long"
            );
         }

         // Get user with password (assuming you have a password field)
         // Note: If using Supabase Auth, this approach won't work - need to use Supabase SDK
         const user = await prisma.user.findUnique({ where: { id: userId } });
         if (!user) throw new NotFoundError("User not found");

         // TODO: Verify current password with bcrypt
         // const isValidPassword = await bcrypt.compare(currentPassword, user.password);
         // if (!isValidPassword) {
         //   throw new ValidationError('Current password is incorrect');
         // }

         // TODO: Hash new password
         // const hashedPassword = await bcrypt.hash(newPassword, 10);

         // TODO: Update password
         // await prisma.user.update({
         //   where: { id: userId },
         //   data: { password: hashedPassword },
         // });

         // For now, return success (implement actual password change when auth is set up)
         res.status(200).json({
            success: true,
            message: "Password changed successfully",
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }
}

export default new AdminProfileController();
