/**
 * Admin Appointments Controller
 *
 * Handles HTTP requests for admin appointment (booking) management
 */

import { Request, Response, NextFunction } from "express";
import prisma from "../../lib/prisma";
import { ValidationError, NotFoundError } from "../../utils/errors";

class AdminAppointmentsController {
   /**
    * GET /api/v1/admin/appointments
    * Get all appointments with pagination and filtering
    */
   async getAllAppointments(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const page = parseInt(req.query.page as string) || 1;
         const limit = parseInt(req.query.limit as string) || 10;
         const status = req.query.status as string;
         const branchId = req.query.branchId as string;
         const search = req.query.search as string; // Search by guest name
         const skip = (page - 1) * limit;

         const where: any = {};
         if (status) where.status = status;
         if (branchId) where.branchId = branchId;
         if (search) {
            where.OR = [
               { guestName: { contains: search, mode: "insensitive" } },
               { guestEmail: { contains: search, mode: "insensitive" } },
            ];
         }

         const [appointments, total] = await Promise.all([
            prisma.booking.findMany({
               where,
               skip,
               take: limit,
               include: {
                  branch: true,
                  user: {
                     select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true,
                     },
                  },
               },
               orderBy: { appointmentDate: "desc" },
            }),
            prisma.booking.count({ where }),
         ]);

         // Fetch services separately for each booking and map customer info
         const appointmentsWithServices = await Promise.all(
            appointments.map(async (appointment) => {
               const services = await prisma.service.findMany({
                  where: { id: { in: appointment.serviceIds } },
               });
               
               // Prioritize user info over guest info
               const customerName = appointment.user?.fullName || appointment.guestName || "Guest";
               const customerEmail = appointment.user?.email || appointment.guestEmail || "";
               const customerPhone = appointment.user?.phone || appointment.guestPhone || "";
               
               return { 
                  ...appointment, 
                  services,
                  // Add mapped fields for frontend
                  customerName,
                  customerEmail,
                  customerPhone,
                  // Keep original fields for backward compatibility
                  guestName: customerName,
                  guestEmail: customerEmail,
                  guestPhone: customerPhone,
               };
            })
         );

         res.status(200).json({
            success: true,
            data: {
               items: appointmentsWithServices,
               total,
               page,
               limit,
               totalPages: Math.ceil(total / limit),
            },
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * GET /api/v1/admin/appointments/:id
    * Get appointment details by ID
    */
   async getAppointmentById(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const id = req.params.id as string;
         if (!id) throw new ValidationError("Appointment ID is required");

         const appointment = await prisma.booking.findUnique({
            where: { id },
            include: {
               branch: true,
               user: true,
            },
         });

         if (!appointment) throw new NotFoundError("Appointment not found");

         // Fetch services separately
         const services = await prisma.service.findMany({
            where: { id: { in: appointment.serviceIds } },
         });

         res.status(200).json({
            success: true,
            data: { ...appointment, services },
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * POST /api/v1/admin/appointments
    * Create a new appointment
    */
   async createAppointment(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const {
            userId,
            serviceIds,
            branchId,
            appointmentDate,
            appointmentTime,
            guestName,
            guestEmail,
            guestPhone,
            notes,
         } = req.body;

         if (
            !serviceIds ||
            !Array.isArray(serviceIds) ||
            serviceIds.length === 0 ||
            !branchId ||
            !appointmentDate ||
            !appointmentTime
         ) {
            throw new ValidationError(
               "Missing required fields: serviceIds (array), branchId, appointmentDate, appointmentTime"
            );
         }

         // Generate unique reference number
         const referenceNumber = `APT-${Date.now()}-${Math.random()
            .toString(36)
            .substring(7)
            .toUpperCase()}`;

         const appointment = await prisma.booking.create({
            data: {
               referenceNumber,
               userId: userId || undefined,
               serviceIds,
               branchId,
               appointmentDate: new Date(appointmentDate),
               appointmentTime,
               guestName: guestName || undefined,
               guestEmail: guestEmail || undefined,
               guestPhone: guestPhone || undefined,
               notes: notes || undefined,
               status: "CONFIRMED",
            },
         });

         res.status(201).json({
            success: true,
            data: appointment,
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * PUT /api/v1/admin/appointments/:id
    * Update appointment details
    */
   async updateAppointment(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const id = req.params.id as string;
         if (!id) throw new ValidationError("Appointment ID is required");

         const appointment = await prisma.booking.findUnique({ where: { id } });
         if (!appointment) throw new NotFoundError("Appointment not found");

         const updated = await prisma.booking.update({
            where: { id },
            data: {
               ...(req.body.serviceIds &&
                  Array.isArray(req.body.serviceIds) && {
                     serviceIds: req.body.serviceIds,
                  }),
               ...(req.body.branchId && { branchId: req.body.branchId }),
               ...(req.body.appointmentDate && {
                  appointmentDate: new Date(req.body.appointmentDate),
               }),
               ...(req.body.appointmentTime && {
                  appointmentTime: req.body.appointmentTime,
               }),
               ...(req.body.guestName && { guestName: req.body.guestName }),
               ...(req.body.guestEmail && { guestEmail: req.body.guestEmail }),
               ...(req.body.guestPhone && { guestPhone: req.body.guestPhone }),
               ...(req.body.notes && { notes: req.body.notes }),
            },
         });

         res.status(200).json({
            success: true,
            data: updated,
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * DELETE /api/v1/admin/appointments/:id
    * Delete an appointment
    */
   async deleteAppointment(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const id = req.params.id as string;
         if (!id) throw new ValidationError("Appointment ID is required");

         const appointment = await prisma.booking.findUnique({ where: { id } });
         if (!appointment) throw new NotFoundError("Appointment not found");

         await prisma.booking.delete({ where: { id } });

         res.status(200).json({
            success: true,
            message: "Appointment deleted successfully",
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * PATCH /api/v1/admin/appointments/:id/status
    * Update appointment status
    */
   async updateStatus(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const id = req.params.id as string;
         const { status } = req.body;

         if (!id) throw new ValidationError("Appointment ID is required");
         if (!status) throw new ValidationError("Status is required");

         const validStatuses = [
            "CONFIRMED",
            "COMPLETED",
            "CANCELLED",
            "NO_SHOW",
            "PENDING",
         ];
         if (!validStatuses.includes(status)) {
            throw new ValidationError(
               `Invalid status. Must be one of: ${validStatuses.join(", ")}`
            );
         }

         const appointment = await prisma.booking.findUnique({ where: { id } });
         if (!appointment) throw new NotFoundError("Appointment not found");

         const updated = await prisma.booking.update({
            where: { id },
            data: {
               status,
               ...(status === "CANCELLED" &&
                  req.body.cancellationReason && {
                     cancellationReason: req.body.cancellationReason,
                  }),
            },
         });

         res.status(200).json({
            success: true,
            data: updated,
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }
}

export default new AdminAppointmentsController();
