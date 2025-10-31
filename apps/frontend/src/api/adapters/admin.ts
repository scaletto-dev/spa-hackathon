/**
 * Admin API Adapter
 * Handles all admin CRUD operations
 * Base URL: /api/v1/admin
 */

const API_BASE_URL =
   import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const ADMIN_API = `${API_BASE_URL}/api/v1/admin`;

// Helper to get auth token
const getAuthToken = () => {
   // Check for accessToken (standard auth token) or adminToken (legacy)
   const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("adminToken") ||
      sessionStorage.getItem("accessToken") ||
      sessionStorage.getItem("adminToken");
   return token || "";
};

// Helper for API requests with auto 401 handling
const apiCall = async (method: string, endpoint: string, body?: any) => {
   const url = `${ADMIN_API}${endpoint}`;
   const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
   };

   const options: RequestInit = {
      method,
      headers,
   };

   if (body) {
      options.body = JSON.stringify(body);
   }

   const response = await fetch(url, options);

   if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.error || `API Error: ${response.status}`;

      // Auto-redirect on 401 Unauthorized
      if (response.status === 401) {
         // Clear auth data
         localStorage.removeItem("accessToken");
         localStorage.removeItem("user_data");
         localStorage.removeItem("refresh_token");

         // Redirect to admin login
         window.location.href = "/admin/login";

         throw new Error("401: Unauthorized - Session expired");
      }

      throw new Error(errorMessage);
   }

   return response.json();
};

// ============= DASHBOARD =============

export const adminDashboardAPI = {
   // GET /dashboard/stats
   // Query params: ?period=week|month|year|today|custom&from=ISO_DATE&to=ISO_DATE
   getStats: async (params?: {
      period?: string;
      from?: string;
      to?: string;
   }) => {
      let endpoint = "/dashboard/stats";
      if (params) {
         const queryParams = new URLSearchParams();
         if (params.period) queryParams.append("period", params.period);
         if (params.from) queryParams.append("from", params.from);
         if (params.to) queryParams.append("to", params.to);
         const queryString = queryParams.toString();
         if (queryString) endpoint += `?${queryString}`;
      }
      return apiCall("GET", endpoint);
   },
};

// ============= PROFILE =============

export const adminProfileAPI = {
   // GET /profile
   getProfile: async () => {
      return apiCall("GET", "/profile");
   },

   // PUT /profile
   updateProfile: async (data: {
      fullName?: string;
      phone?: string;
      language?: string;
      avatar?: string;
   }) => {
      return apiCall("PUT", "/profile", data);
   },

   // POST /profile/change-password
   changePassword: async (data: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
   }) => {
      return apiCall("POST", "/profile/change-password", data);
   },
};

// ============= CUSTOMERS =============

export const adminCustomersAPI = {
   // GET /customers
   getAll: async (page = 1, limit = 10, role?: string) => {
      let endpoint = `/customers?page=${page}&limit=${limit}`;
      if (role) endpoint += `&role=${role}`;
      return apiCall("GET", endpoint);
   },

   // GET /customers/:id
   getById: async (id: string) => {
      return apiCall("GET", `/customers/${id}`);
   },

   // POST /customers
   create: async (data: {
      email: string;
      phone: string;
      fullName: string;
      language?: string;
   }) => {
      return apiCall("POST", "/customers", data);
   },

   // PUT /customers/:id
   update: async (id: string, data: any) => {
      return apiCall("PUT", `/customers/${id}`, data);
   },

   // DELETE /customers/:id
   delete: async (id: string) => {
      return apiCall("DELETE", `/customers/${id}`);
   },

   // PATCH /customers/:id/verify-email
   verifyEmail: async (id: string) => {
      return apiCall("PATCH", `/customers/${id}/verify-email`);
   },
};

// ============= SERVICES =============

export const adminServicesAPI = {
   // GET /services
   getAll: async (page = 1, limit = 10, categoryId?: string) => {
      let endpoint = `/services?page=${page}&limit=${limit}`;
      if (categoryId) endpoint += `&categoryId=${categoryId}`;
      return apiCall("GET", endpoint);
   },

   // GET /services/:id
   getById: async (id: string) => {
      return apiCall("GET", `/services/${id}`);
   },

   // POST /services
   create: async (data: {
      name: string;
      slug: string;
      description: string;
      excerpt: string;
      duration: number;
      price: string;
      categoryId: string;
      images?: string[];
      benefits?: string[];
   }) => {
      return apiCall("POST", "/services", data);
   },

   // PUT /services/:id
   update: async (id: string, data: any) => {
      return apiCall("PUT", `/services/${id}`, data);
   },

   // DELETE /services/:id
   delete: async (id: string) => {
      return apiCall("DELETE", `/services/${id}`);
   },

   // PATCH /services/:id/toggle-featured
   toggleFeatured: async (id: string) => {
      return apiCall("PATCH", `/services/${id}/toggle-featured`);
   },

   // PATCH /services/:id/toggle-active
   toggleActive: async (id: string) => {
      return apiCall("PATCH", `/services/${id}/toggle-active`);
   },
};

// ============= BRANCHES =============

export const adminBranchesAPI = {
   // GET /branches
   getAll: async (page = 1, limit = 10) => {
      return apiCall("GET", `/branches?page=${page}&limit=${limit}`);
   },

   // GET /branches/:id
   getById: async (id: string) => {
      return apiCall("GET", `/branches/${id}`);
   },

   // POST /branches
   create: async (data: {
      name: string;
      slug: string;
      address: string;
      phone: string;
      email?: string;
      latitude: string;
      longitude: string;
      operatingHours: Record<string, string>;
      images?: string[];
   }) => {
      return apiCall("POST", "/branches", data);
   },

   // PUT /branches/:id
   update: async (id: string, data: any) => {
      return apiCall("PUT", `/branches/${id}`, data);
   },

   // DELETE /branches/:id
   delete: async (id: string) => {
      return apiCall("DELETE", `/branches/${id}`);
   },

   // PATCH /branches/:id/toggle-active
   toggleActive: async (id: string) => {
      return apiCall("PATCH", `/branches/${id}/toggle-active`);
   },
};

// ============= APPOINTMENTS =============

export const adminAppointmentsAPI = {
   // GET /appointments
   getAll: async (
      page = 1,
      limit = 10,
      status?: string,
      search?: string
   ) => {
      let endpoint = `/appointments?page=${page}&limit=${limit}`;
      if (status) endpoint += `&status=${status}`;
      if (search) endpoint += `&search=${encodeURIComponent(search)}`;
      const response = await apiCall("GET", endpoint);
      return {
         data: response.data?.items || [],
         pagination: {
            total: response.data?.total || 0,
            page: response.data?.page || page,
            limit: response.data?.limit || limit,
            totalPages: response.data?.totalPages || 0,
         },
      };
   },

   // GET /appointments/:id
   getById: async (id: string) => {
      return apiCall("GET", `/appointments/${id}`);
   },

   // POST /appointments
   create: async (data: {
      serviceIds: string[];
      branchId: string;
      appointmentDate: string;
      appointmentTime: string;
      guestName?: string;
      guestEmail?: string;
      guestPhone?: string;
      notes?: string;
      userId?: string;
   }) => {
      return apiCall("POST", "/appointments", data);
   },

   // PUT /appointments/:id
   update: async (id: string, data: any) => {
      return apiCall("PUT", `/appointments/${id}`, data);
   },

   // PATCH /appointments/:id/status
   updateStatus: async (
      id: string,
      status: string,
      cancellationReason?: string
   ) => {
      return apiCall("PATCH", `/appointments/${id}/status`, {
         status,
         ...(cancellationReason && { cancellationReason }),
      });
   },

   // DELETE /appointments/:id
   delete: async (id: string) => {
      return apiCall("DELETE", `/appointments/${id}`);
   },
};

// ============= REVIEWS =============

export const adminReviewsAPI = {
   // GET /reviews
   getAll: async (page = 1, limit = 10, approved?: boolean) => {
      let endpoint = `/reviews?page=${page}&limit=${limit}`;
      if (approved !== undefined) endpoint += `&approved=${approved}`;
      return apiCall("GET", endpoint);
   },

   // GET /reviews/:id
   getById: async (id: string) => {
      return apiCall("GET", `/reviews/${id}`);
   },

   // PATCH /reviews/:id/approve
   approve: async (id: string) => {
      return apiCall("PATCH", `/reviews/${id}/approve`);
   },

   // PATCH /reviews/:id/reject
   reject: async (id: string) => {
      return apiCall("PATCH", `/reviews/${id}/reject`);
   },

   // PATCH /reviews/:id/response
   addResponse: async (id: string, response: string) => {
      return apiCall("PATCH", `/reviews/${id}/response`, { response });
   },

   // DELETE /reviews/:id
   delete: async (id: string) => {
      return apiCall("DELETE", `/reviews/${id}`);
   },
};

// ============= BLOG =============

export const adminBlogAPI = {
   // GET /blog/posts
   getAll: async (page = 1, limit = 10, published?: boolean) => {
      let endpoint = `/blog/posts?page=${page}&limit=${limit}`;
      if (published !== undefined) endpoint += `&published=${published}`;
      return apiCall("GET", endpoint);
   },

   // GET /blog/posts/:id
   getById: async (id: string) => {
      return apiCall("GET", `/blog/posts/${id}`);
   },

   // POST /blog/posts
   create: async (data: {
      title: string;
      slug: string;
      content: string;
      excerpt: string;
      featuredImage?: string;
      categoryId: string;
      authorId: string;
   }) => {
      return apiCall("POST", "/blog/posts", data);
   },

   // PUT /blog/posts/:id
   update: async (id: string, data: any) => {
      return apiCall("PUT", `/blog/posts/${id}`, data);
   },

   // PATCH /blog/posts/:id/publish
   publish: async (id: string) => {
      return apiCall("PATCH", `/blog/posts/${id}/publish`);
   },

   // PATCH /blog/posts/:id/unpublish
   unpublish: async (id: string) => {
      return apiCall("PATCH", `/blog/posts/${id}/unpublish`);
   },

   // DELETE /blog/posts/:id
   delete: async (id: string) => {
      return apiCall("DELETE", `/blog/posts/${id}`);
   },
};

// ============= CATEGORIES =============

export const adminCategoriesAPI = {
   // SERVICE CATEGORIES
   service: {
      // GET /categories/service
      getAll: async (page = 1, limit = 10) => {
         return apiCall(
            "GET",
            `/categories/service?page=${page}&limit=${limit}`
         );
      },

      // POST /categories/service
      create: async (data: {
         name: string;
         slug: string;
         description?: string;
         icon?: string;
         displayOrder?: number;
      }) => {
         return apiCall("POST", "/categories/service", data);
      },

      // PUT /categories/service/:id
      update: async (id: string, data: any) => {
         return apiCall("PUT", `/categories/service/${id}`, data);
      },

      // DELETE /categories/service/:id
      delete: async (id: string) => {
         return apiCall("DELETE", `/categories/service/${id}`);
      },
   },

   // BLOG CATEGORIES
   blog: {
      // GET /categories/blog
      getAll: async (page = 1, limit = 10) => {
         return apiCall("GET", `/categories/blog?page=${page}&limit=${limit}`);
      },

      // POST /categories/blog
      create: async (data: {
         name: string;
         slug: string;
         description?: string;
      }) => {
         return apiCall("POST", "/categories/blog", data);
      },

      // PUT /categories/blog/:id
      update: async (id: string, data: any) => {
         return apiCall("PUT", `/categories/blog/${id}`, data);
      },

      // DELETE /categories/blog/:id
      delete: async (id: string) => {
         return apiCall("DELETE", `/categories/blog/${id}`);
      },
   },
};

// ============= CONTACTS =============

export const adminContactsAPI = {
   // GET /contacts
   getAll: async (page = 1, limit = 10, status?: string) => {
      let endpoint = `/contacts?page=${page}&limit=${limit}`;
      if (status) endpoint += `&status=${status}`;
      return apiCall("GET", endpoint);
   },

   // GET /contacts/:id
   getById: async (id: string) => {
      return apiCall("GET", `/contacts/${id}`);
   },

   // GET /contacts/stats
   getStats: async () => {
      return apiCall("GET", "/contacts/stats");
   },

   // PATCH /contacts/:id/status
   updateStatus: async (id: string, status: string) => {
      return apiCall("PATCH", `/contacts/${id}/status`, { status });
   },

   // PATCH /contacts/:id/notes
   addNotes: async (id: string, notes: string) => {
      return apiCall("PATCH", `/contacts/${id}/notes`, { notes });
   },

   // DELETE /contacts/:id
   delete: async (id: string) => {
      return apiCall("DELETE", `/contacts/${id}`);
   },
};

// Payments API
export const adminPaymentsAPI = {
   // GET /payments?page=1&limit=10&status=COMPLETED&paymentType=ATM
   getAll: async (
      page: number = 1,
      limit: number = 10,
      filters?: { status?: string; paymentType?: string }
   ) => {
      const params = new URLSearchParams({
         page: page.toString(),
         limit: limit.toString(),
         ...(filters?.status && { status: filters.status }),
         ...(filters?.paymentType && { paymentType: filters.paymentType }),
      });
      return apiCall("GET", `/payments?${params.toString()}`);
   },

   // GET /payments/stats
   getStats: async () => {
      return apiCall("GET", "/payments/stats");
   },

   // GET /payments/:id
   getById: async (id: string) => {
      return apiCall("GET", `/payments/${id}`);
   },

   // POST /payments
   create: async (data: {
      bookingId: string;
      amount: number;
      currency?: string;
      paymentType?: string;
      status?: string;
      transactionId?: string;
      notes?: string;
   }) => {
      return apiCall("POST", "/payments", data);
   },

   // PATCH /payments/:id/status
   updateStatus: async (id: string, status: string) => {
      return apiCall("PATCH", `/payments/${id}/status`, { status });
   },

   // DELETE /payments/:id
   delete: async (id: string) => {
      return apiCall("DELETE", `/payments/${id}`);
   },
};

// Upload API
export const uploadAPI = {
   // POST /upload/image?folder=blog
   uploadImage: async (
      file: File,
      folder: "blog" | "branches" | "profile" | "service" = "blog"
   ) => {
      const formData = new FormData();
      formData.append("image", file);

      const url = `${API_BASE_URL}/api/v1/upload/image?folder=${folder}`;
      const response = await fetch(url, {
         method: "POST",
         headers: {
            Authorization: `Bearer ${getAuthToken()}`,
         },
         body: formData,
      });

      if (!response.ok) {
         const error = await response.json();
         throw new Error(error.message || "Upload failed");
      }

      const result = await response.json();
      return result.data.url; // Return the uploaded image URL
   },
};

// Export all APIs
export default {
   customers: adminCustomersAPI,
   services: adminServicesAPI,
   branches: adminBranchesAPI,
   appointments: adminAppointmentsAPI,
   reviews: adminReviewsAPI,
   blog: adminBlogAPI,
   categories: adminCategoriesAPI,
   contacts: adminContactsAPI,
   payments: adminPaymentsAPI,
};
