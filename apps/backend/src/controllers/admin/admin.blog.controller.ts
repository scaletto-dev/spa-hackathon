/**
 * Admin Blog Controller
 *
 * Handles HTTP requests for admin blog management
 * Includes create, update, delete, and publish operations
 */

import { Request, Response, NextFunction } from "express";
import prisma from "../../lib/prisma";
import { ValidationError, NotFoundError } from "../../utils/errors";

class AdminBlogController {
   /**
    * GET /api/v1/admin/blog/posts
    * Get all blog posts with pagination
    */
   async getAllPosts(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const page = parseInt(req.query.page as string) || 1;
         const limit = parseInt(req.query.limit as string) || 10;
         const published = req.query.published as string;
         const categoryId = req.query.categoryId as string;
         const skip = (page - 1) * limit;

         const where: any = {};
         if (published !== undefined) where.published = published === "true";
         if (categoryId) where.categoryId = categoryId;

         const [posts, total] = await Promise.all([
            prisma.blogPost.findMany({
               where,
               skip,
               take: limit,
               include: {
                  author: { select: { id: true, fullName: true, email: true } },
                  category: true,
               },
               orderBy: { createdAt: "desc" },
            }),
            prisma.blogPost.count({ where }),
         ]);

         res.status(200).json({
            success: true,
            data: posts,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * GET /api/v1/admin/blog/posts/:id
    * Get blog post details by ID
    */
   async getPostById(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const id = req.params.id as string;
         if (!id) throw new ValidationError("Post ID is required");

         const post = await prisma.blogPost.findUnique({
            where: { id },
            include: { author: true, category: true },
         });

         if (!post) throw new NotFoundError("Blog post not found");

         res.status(200).json({
            success: true,
            data: post,
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * POST /api/v1/admin/blog/posts
    * Create a new blog post
    */
   async createPost(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const {
            title,
            slug,
            content,
            excerpt,
            featuredImage,
            categoryId,
            authorId,
            language = "vi",
         } = req.body;

         if (
            !title ||
            !slug ||
            !content ||
            !excerpt ||
            !categoryId ||
            !authorId
         ) {
            throw new ValidationError(
               "Missing required fields: title, slug, content, excerpt, categoryId, authorId"
            );
         }

         const existingSlug = await prisma.blogPost.findUnique({
            where: { slug },
         });
         if (existingSlug)
            throw new ValidationError("Post slug already exists");

         const post = await prisma.blogPost.create({
            data: {
               title,
               slug,
               content,
               excerpt,
               ...(featuredImage && { featuredImage }),
               categoryId,
               authorId,
               language,
               published: false,
            },
         });

         res.status(201).json({
            success: true,
            data: post,
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * PUT /api/v1/admin/blog/posts/:id
    * Update blog post details
    */
   async updatePost(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const id = req.params.id as string;
         if (!id) throw new ValidationError("Post ID is required");

         const post = await prisma.blogPost.findUnique({ where: { id } });
         if (!post) throw new NotFoundError("Blog post not found");

         if (req.body.slug && req.body.slug !== post.slug) {
            const existingSlug = await prisma.blogPost.findUnique({
               where: { slug: req.body.slug },
            });
            if (existingSlug)
               throw new ValidationError("Post slug already exists");
         }

         const updated = await prisma.blogPost.update({
            where: { id },
            data: {
               ...(req.body.title && { title: req.body.title }),
               ...(req.body.slug && { slug: req.body.slug }),
               ...(req.body.content && { content: req.body.content }),
               ...(req.body.excerpt && { excerpt: req.body.excerpt }),
               ...(req.body.featuredImage && {
                  featuredImage: req.body.featuredImage,
               }),
               ...(req.body.categoryId && { categoryId: req.body.categoryId }),
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
    * DELETE /api/v1/admin/blog/posts/:id
    * Delete a blog post
    */
   async deletePost(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const id = req.params.id as string;
         if (!id) throw new ValidationError("Post ID is required");

         const post = await prisma.blogPost.findUnique({ where: { id } });
         if (!post) throw new NotFoundError("Blog post not found");

         await prisma.blogPost.delete({ where: { id } });

         res.status(200).json({
            success: true,
            message: "Blog post deleted successfully",
            timestamp: new Date().toISOString(),
         });
      } catch (error) {
         next(error);
      }
   }

   /**
    * PATCH /api/v1/admin/blog/posts/:id/publish
    * Publish a blog post
    */
   async publishPost(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const id = req.params.id as string;
         if (!id) throw new ValidationError("Post ID is required");

         const post = await prisma.blogPost.findUnique({ where: { id } });
         if (!post) throw new NotFoundError("Blog post not found");

         const updated = await prisma.blogPost.update({
            where: { id },
            data: { published: true, publishedAt: new Date() },
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
    * PATCH /api/v1/admin/blog/posts/:id/unpublish
    * Unpublish a blog post
    */
   async unpublishPost(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const id = req.params.id as string;
         if (!id) throw new ValidationError("Post ID is required");

         const post = await prisma.blogPost.findUnique({ where: { id } });
         if (!post) throw new NotFoundError("Blog post not found");

         const updated = await prisma.blogPost.update({
            where: { id },
            data: { published: false, publishedAt: null },
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

export default new AdminBlogController();
