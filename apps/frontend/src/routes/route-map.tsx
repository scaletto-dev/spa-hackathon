import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouteObject, Navigate } from 'react-router-dom';
import { RootErrorBoundary, Pending } from './RootBoundary';
import { RequireRole } from './guards/RequireRole';
import { ScrollToTop } from '../client/components/ScrollToTop';

// Lazy load layouts
const ClientLayout = lazy(() => import('./layouts/ClientLayoutWrapper'));
const AdminLayout = lazy(() => import('./layouts/AdminLayoutWrapper'));

// Lazy load client pages
const Home = lazy(() => import('../client/pages/Home'));
const ServicesPage = lazy(() => import('../client/pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('../client/pages/ServiceDetailPage'));
const ReviewsPage = lazy(() => import('../client/pages/ReviewsPage'));
const BookingPage = lazy(() => import('../client/pages/BookingPage'));
const BranchesPage = lazy(() => import('../client/pages/BranchesPage'));
const BlogPage = lazy(() => import('../client/pages/BlogPage'));
const BlogDetailPage = lazy(() => import('../client/pages/BlogDetailPage'));
const QuizPage = lazy(() => import('../client/pages/QuizPage'));
const FormShowcasePage = lazy(() => import('../client/pages/FormShowcasePage'));
const ContactPage = lazy(() => import('../client/pages/ContactPage'));

// Auth pages
const LoginPageOTP = lazy(() => import('../client/pages/LoginPageOTP'));
const RegisterPageOTP = lazy(() => import('../client/pages/RegisterPageOTP'));
const AdminLoginPage = lazy(() => import('../admin/pages/AdminLoginPage'));

// Member dashboard pages (Protected)
const MemberDashboard = lazy(() => import('../client/pages/dashboard/MemberDashboard'));
const BookingHistory = lazy(() => import('../client/pages/dashboard/BookingHistory'));
const ProfileManagement = lazy(() => import('../client/pages/dashboard/ProfileManagement'));

// Lazy load admin pages
const Dashboard = lazy(() => import('../admin/pages/Dashboard'));
const Appointments = lazy(() => import('../admin/pages/Appointments'));
const AdminServices = lazy(() => import('../admin/pages/Services'));
const AdminBranches = lazy(() => import('../admin/pages/Branches'));
const Customers = lazy(() => import('../admin/pages/Customers'));
const Staff = lazy(() => import('../admin/pages/Staff'));
const Payments = lazy(() => import('../admin/pages/Payments'));
const AdminReviews = lazy(() => import('../admin/pages/Reviews'));
const AdminBlog = lazy(() => import('../admin/pages/Blog'));
const Settings = lazy(() => import('../admin/pages/Settings'));

/**
 * Route Configuration
 * Using React Router v6 with createBrowserRouter
 *
 * Features:
 * - Lazy loading with Suspense for code splitting
 * - Error boundaries for graceful error handling
 * - RBAC guards (RequireRole) for admin routes
 * - All paths preserved from original routing
 *
 * TODO: Add ProtectedRoute guards when auth system is implemented
 * TODO: Add login page when available
 */
export const routes: RouteObject[] = [
    // Client Routes (Public)
    {
        path: '/',
        element: (
            <RootErrorBoundary>
                <Suspense fallback={<Pending />}>
                    <ScrollToTop />
                    <ClientLayout />
                </Suspense>
            </RootErrorBoundary>
        ),
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<Pending />}>
                        <Home />
                    </Suspense>
                ),
            },
            {
                path: 'services',
                element: (
                    <Suspense fallback={<Pending />}>
                        <ServicesPage />
                    </Suspense>
                ),
            },
            {
                path: 'services/:id',
                element: (
                    <Suspense fallback={<Pending />}>
                        <ServiceDetailPage />
                    </Suspense>
                ),
            },
            {
                path: 'reviews',
                element: (
                    <Suspense fallback={<Pending />}>
                        <ReviewsPage />
                    </Suspense>
                ),
            },
            {
                path: 'booking',
                element: (
                    <Suspense fallback={<Pending />}>
                        <BookingPage />
                    </Suspense>
                ),
            },
            {
                path: 'branches',
                element: (
                    <Suspense fallback={<Pending />}>
                        <BranchesPage />
                    </Suspense>
                ),
            },
            {
                path: 'blog',
                element: (
                    <Suspense fallback={<Pending />}>
                        <BlogPage />
                    </Suspense>
                ),
            },
            {
                path: 'blog/:slug',
                element: (
                    <Suspense fallback={<Pending />}>
                        <BlogDetailPage />
                    </Suspense>
                ),
            },
            {
                path: 'quiz',
                element: (
                    <Suspense fallback={<Pending />}>
                        <QuizPage />
                    </Suspense>
                ),
            },
            {
                path: 'form-showcase',
                element: (
                    <Suspense fallback={<Pending />}>
                        <FormShowcasePage />
                    </Suspense>
                ),
            },
            {
                path: 'contact',
                element: (
                    <Suspense fallback={<Pending />}>
                        <ContactPage />
                    </Suspense>
                ),
            },
        ],
    },

    // Auth Routes (Standalone - No Layout)
    {
        path: '/login',
        element: (
            <RootErrorBoundary>
                <Suspense fallback={<Pending />}>
                    <LoginPageOTP />
                </Suspense>
            </RootErrorBoundary>
        ),
    },
    {
        path: '/register',
        element: (
            <RootErrorBoundary>
                <Suspense fallback={<Pending />}>
                    <RegisterPageOTP />
                </Suspense>
            </RootErrorBoundary>
        ),
    },
    {
        path: '/admin/login',
        element: (
            <RootErrorBoundary>
                <Suspense fallback={<Pending />}>
                    <AdminLoginPage />
                </Suspense>
            </RootErrorBoundary>
        ),
    },

    // Member Dashboard Routes (Protected - Requires Client Role)
    {
        path: '/dashboard',
        element: (
            <RootErrorBoundary>
                <Suspense fallback={<Pending />}>
                    <RequireRole role='client'>
                        <ScrollToTop />
                        <ClientLayout />
                    </RequireRole>
                </Suspense>
            </RootErrorBoundary>
        ),
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<Pending />}>
                        <MemberDashboard />
                    </Suspense>
                ),
            },
            {
                path: 'bookings',
                element: (
                    <Suspense fallback={<Pending />}>
                        <BookingHistory />
                    </Suspense>
                ),
            },
            {
                path: 'profile',
                element: (
                    <Suspense fallback={<Pending />}>
                        <ProfileManagement />
                    </Suspense>
                ),
            },
        ],
    },

    // Admin Routes (Protected - Requires Admin Role)
    {
        path: '/admin',
        element: (
            <RootErrorBoundary>
                <Suspense fallback={<Pending />}>
                    <RequireRole role='admin'>
                        <ScrollToTop />
                        <AdminLayout />
                    </RequireRole>
                </Suspense>
            </RootErrorBoundary>
        ),
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<Pending />}>
                        <Dashboard />
                    </Suspense>
                ),
            },
            {
                path: 'appointments',
                element: (
                    <Suspense fallback={<Pending />}>
                        <Appointments />
                    </Suspense>
                ),
            },
            {
                path: 'services',
                element: (
                    <Suspense fallback={<Pending />}>
                        <AdminServices />
                    </Suspense>
                ),
            },
            {
                path: 'branches',
                element: (
                    <Suspense fallback={<Pending />}>
                        <AdminBranches />
                    </Suspense>
                ),
            },
            {
                path: 'customers',
                element: (
                    <Suspense fallback={<Pending />}>
                        <Customers />
                    </Suspense>
                ),
            },
            {
                path: 'staff',
                element: (
                    <Suspense fallback={<Pending />}>
                        <Staff />
                    </Suspense>
                ),
            },
            {
                path: 'payments',
                element: (
                    <Suspense fallback={<Pending />}>
                        <Payments />
                    </Suspense>
                ),
            },
            {
                path: 'reviews',
                element: (
                    <Suspense fallback={<Pending />}>
                        <AdminReviews />
                    </Suspense>
                ),
            },
            {
                path: 'blog',
                element: (
                    <Suspense fallback={<Pending />}>
                        <AdminBlog />
                    </Suspense>
                ),
            },
            {
                path: 'settings',
                element: (
                    <Suspense fallback={<Pending />}>
                        <Settings />
                    </Suspense>
                ),
            },
        ],
    },

    // Catch-all: Redirect to home
    {
        path: '*',
        element: <Navigate to='/' replace />,
    },
];

/**
 * Browser Router Instance
 * Export this to use in main.tsx with RouterProvider
 */
export const router = createBrowserRouter(routes);
