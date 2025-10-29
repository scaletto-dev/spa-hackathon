import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Admin imports
import { AdminLayout } from './admin/layouts/AdminLayout';
import { Dashboard } from './admin/pages/Dashboard';
import { Appointments } from './admin/pages/Appointments';
import { Services as AdminServices } from './admin/pages/Services';
import { Branches as AdminBranches } from './admin/pages/Branches';
import { Customers } from './admin/pages/Customers';
import { Staff } from './admin/pages/Staff';
import { Payments } from './admin/pages/Payments';
import { Reviews as AdminReviews } from './admin/pages/Reviews';
import { Blog as AdminBlog } from './admin/pages/Blog';
import { Settings } from './admin/pages/Settings';

// Client imports
import { ClientLayout } from './client/layouts/ClientLayout';
import { Home } from './client/pages/Home';
import { ServicesPage } from './client/pages/ServicesPage';
import { BookingPage } from './client/pages/BookingPage';
import { BranchesPage } from './client/pages/BranchesPage';
import { BlogPage } from './client/pages/BlogPage';
import BlogDetailPage from './client/pages/BlogDetailPage';
import QuizPage from './client/pages/QuizPage';
import FormShowcasePage from './client/pages/FormShowcasePage';
import { ContactPage } from './client/pages/ContactPage';
import { ScrollToTop } from './client/components/ScrollToTop';

export function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                {/* Admin Routes */}
                <Route path='/admin' element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path='appointments' element={<Appointments />} />
                    <Route path='services' element={<AdminServices />} />
                    <Route path='branches' element={<AdminBranches />} />
                    <Route path='customers' element={<Customers />} />
                    <Route path='staff' element={<Staff />} />
                    <Route path='payments' element={<Payments />} />
                    <Route path='reviews' element={<AdminReviews />} />
                    <Route path='blog' element={<AdminBlog />} />
                    <Route path='settings' element={<Settings />} />
                </Route>

                {/* Client Routes */}
                <Route path='/' element={<ClientLayout />}>
                    <Route index element={<Home />} />
                    <Route path='services' element={<ServicesPage />} />
                    <Route path='booking' element={<BookingPage />} />
                    <Route path='branches' element={<BranchesPage />} />
                    <Route path='blog' element={<BlogPage />} />
                    <Route path='blog/:slug' element={<BlogDetailPage />} />
                    <Route path='quiz' element={<QuizPage />} />
                    <Route path='form-showcase' element={<FormShowcasePage />} />
                    <Route path='contact' element={<ContactPage />} />
                </Route>

                {/* Catch all - redirect to home */}
                <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
        </BrowserRouter>
    );
}
