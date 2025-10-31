// Mock in-memory data store for frontend-only operation
// This replaces all backend API calls with local state management

export interface Service {
    id: number;
    name: string;
    category: string;
    description: string;
    duration: string;
    price: number;
    image: string;
    active: boolean;
}

export interface Branch {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
    image: string;
    location: {
        lat: number;
        lng: number;
    };
    services: string[];
}

export interface Staff {
    id: number;
    name: string;
    role: string;
    email: string;
    phone: string;
    branch: string;
    specialties: string[];
    image: string;
    rating: number;
    totalBookings: number;
    active: boolean;
}

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    dateJoined: string;
    totalVisits: number;
    totalSpent: number;
    lastVisit: string;
    notes: string;
    avatar?: string;
    membershipTier?: 'New' | 'Silver' | 'Gold' | 'VIP';
}

export interface Appointment {
    id: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    service: string;
    therapist: string;
    branch: string;
    date: string;
    time: string;
    duration: string;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
    paymentStatus: 'paid' | 'unpaid' | 'refunded';
    price: number;
    notes?: string;
    customerId?: number;
}

export interface Review {
    id: number;
    customerName: string;
    customerAvatar?: string;
    service: string;
    rating: number;
    comment: string;
    date: string;
    branch: string;
    reply?: string;
    replyDate?: string;
}

export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    authorAvatar?: string;
    image: string;
    date: string;
    readTime: string;
    views: number;
    published: boolean;
    tags: string[];
}

export interface Payment {
    id: number;
    appointmentId: number;
    customerName: string;
    amount: number;
    method: string;
    status: 'completed' | 'pending' | 'refunded' | 'failed';
    date: string;
    transactionId: string;
    service: string;
}

// Initial mock data
class MockDataStore {
    private services: Service[] = [
        {
            id: 1,
            name: 'AI Skin Analysis Facial',
            category: 'Facial',
            description:
                'Advanced AI technology analyzes your skin and creates a personalized treatment plan',
            duration: '60 min',
            price: 150,
            image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop',
            active: true,
        },
        {
            id: 2,
            name: 'Hydrafacial Treatment',
            category: 'Facial',
            description: 'Deep cleansing, exfoliation, and hydration treatment',
            duration: '45 min',
            price: 180,
            image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop',
            active: true,
        },
        {
            id: 3,
            name: 'Laser Hair Removal',
            category: 'Laser',
            description: 'Permanent hair reduction using state-of-the-art laser technology',
            duration: '30-90 min',
            price: 120,
            image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=600&h=400&fit=crop',
            active: true,
        },
        {
            id: 4,
            name: 'Botox & Fillers',
            category: 'Anti-Aging',
            description: 'FDA-approved injectables to reduce wrinkles and restore volume',
            duration: '30 min',
            price: 350,
            image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=400&fit=crop',
            active: true,
        },
    ];

    private branches: Branch[] = [
        {
            id: 1,
            name: 'Downtown Clinic',
            address: '123 Main Street, Downtown, New York, NY 10001',
            phone: '(555) 123-4567',
            email: 'downtown@beautyai.com',
            hours: 'Monday - Friday: 9AM - 7PM\nSaturday: 10AM - 5PM\nSunday: Closed',
            image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop',
            location: { lat: 40.7128, lng: -74.006 },
            services: ['Facial Treatments', 'Laser Therapy', 'Skin Analysis'],
        },
        {
            id: 2,
            name: 'Westside Center',
            address: '456 West Avenue, Westside, Los Angeles, CA 90001',
            phone: '(555) 234-5678',
            email: 'westside@beautyai.com',
            hours: 'Monday - Friday: 9AM - 8PM\nSaturday: 9AM - 6PM\nSunday: 11AM - 4PM',
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
            location: { lat: 34.0522, lng: -118.2437 },
            services: ['Body Contouring', 'Laser Hair Removal', 'Botox & Fillers'],
        },
    ];

    private staff: Staff[] = [
        {
            id: 1,
            name: 'Emma Wilson',
            role: 'Facial Specialist',
            email: 'emma.wilson@beautyai.com',
            phone: '(555) 111-2222',
            branch: 'Downtown Clinic',
            specialties: ['Facial Treatments', 'Skin Analysis', 'Anti-Aging'],
            image: 'https://i.pravatar.cc/150?img=1',
            rating: 4.9,
            totalBookings: 234,
            active: true,
        },
        {
            id: 2,
            name: 'Lisa Anderson',
            role: 'Massage Therapist',
            email: 'lisa.anderson@beautyai.com',
            phone: '(555) 222-3333',
            branch: 'Westside Center',
            specialties: ['Deep Tissue', 'Relaxation', 'Hot Stone'],
            image: 'https://i.pravatar.cc/150?img=5',
            rating: 4.8,
            totalBookings: 189,
            active: true,
        },
    ];

    private customers: Customer[] = [
        {
            id: 1,
            name: 'Sarah Johnson',
            email: 'sarah.j@email.com',
            phone: '(555) 999-1111',
            dateJoined: '2024-01-15',
            totalVisits: 12,
            totalSpent: 1850,
            lastVisit: '2024-10-20',
            notes: 'Prefers morning appointments',
            avatar: 'https://i.pravatar.cc/150?img=10',
        },
        {
            id: 2,
            name: 'Michael Chen',
            email: 'michael.chen@email.com',
            phone: '(555) 888-2222',
            dateJoined: '2024-03-10',
            totalVisits: 8,
            totalSpent: 1200,
            lastVisit: '2024-10-18',
            notes: 'Sensitive skin',
            avatar: 'https://i.pravatar.cc/150?img=12',
        },
    ];

    private appointments: Appointment[] = [
        {
            id: 1,
            customerName: 'Sarah Johnson',
            customerEmail: 'sarah.j@email.com',
            customerPhone: '(555) 999-1111',
            service: 'AI Skin Analysis Facial',
            therapist: 'Emma Wilson',
            branch: 'Downtown Clinic',
            date: '2024-10-30',
            time: '10:00 AM',
            duration: '60 min',
            status: 'confirmed',
            paymentStatus: 'paid',
            price: 150,
            customerId: 1,
        },
        {
            id: 2,
            customerName: 'Michael Chen',
            customerEmail: 'michael.chen@email.com',
            customerPhone: '(555) 888-2222',
            service: 'Hydrafacial Treatment',
            therapist: 'Emma Wilson',
            branch: 'Downtown Clinic',
            date: '2024-10-31',
            time: '2:00 PM',
            duration: '45 min',
            status: 'pending',
            paymentStatus: 'unpaid',
            price: 180,
            customerId: 2,
        },
    ];

    private reviews: Review[] = [
        {
            id: 1,
            customerName: 'Sarah Johnson',
            customerAvatar: 'https://i.pravatar.cc/150?img=10',
            service: 'AI Skin Analysis Facial',
            rating: 5,
            comment:
                'Amazing experience! The AI skin analysis was incredibly detailed and the treatment was perfect for my skin type.',
            date: '2024-10-20',
            branch: 'Downtown Clinic',
        },
        {
            id: 2,
            customerName: 'Michael Chen',
            customerAvatar: 'https://i.pravatar.cc/150?img=12',
            service: 'Hydrafacial Treatment',
            rating: 4,
            comment: 'Great service and professional staff. My skin feels so much better!',
            date: '2024-10-18',
            branch: 'Downtown Clinic',
            reply: "Thank you for your feedback! We're glad you enjoyed your treatment.",
            replyDate: '2024-10-19',
        },
    ];

    private blogPosts: BlogPost[] = [
        {
            id: 1,
            title: 'The Future of AI in Skincare: What You Need to Know',
            slug: 'future-of-ai-in-skincare',
            excerpt:
                'Discover how artificial intelligence is revolutionizing personalized skincare treatments',
            content: 'Full blog content here...',
            category: 'AI Trends',
            author: 'Dr. Emily Parker',
            authorAvatar: 'https://i.pravatar.cc/150?img=20',
            image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=400&fit=crop',
            date: '2024-10-25',
            readTime: '5 min',
            views: 1234,
            published: true,
            tags: ['AI', 'Skincare', 'Technology'],
        },
        {
            id: 2,
            title: '10 Essential Skincare Tips for Winter',
            slug: 'winter-skincare-tips',
            excerpt: 'Keep your skin healthy and glowing throughout the cold season',
            content: 'Full blog content here...',
            category: 'Skincare Tips',
            author: 'Sarah Williams',
            authorAvatar: 'https://i.pravatar.cc/150?img=25',
            image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&h=400&fit=crop',
            date: '2024-10-22',
            readTime: '7 min',
            views: 892,
            published: true,
            tags: ['Skincare', 'Winter', 'Tips'],
        },
    ];

    private payments: Payment[] = [
        {
            id: 1,
            appointmentId: 1,
            customerName: 'Sarah Johnson',
            amount: 150,
            method: 'Credit Card',
            status: 'completed',
            date: '2024-10-20',
            transactionId: 'TXN-001-20241020',
            service: 'AI Skin Analysis Facial',
        },
        {
            id: 2,
            appointmentId: 2,
            customerName: 'Michael Chen',
            amount: 180,
            method: 'Digital Wallet',
            status: 'pending',
            date: '2024-10-25',
            transactionId: 'TXN-002-20241025',
            service: 'Hydrafacial Treatment',
        },
    ];

    // Getters
    getServices = () => [...this.services];
    getBranches = () => [...this.branches];
    getStaff = () => [...this.staff];
    getCustomers = () => [...this.customers];
    getAppointments = () => [...this.appointments];
    getReviews = () => [...this.reviews];
    getBlogPosts = () => [...this.blogPosts];
    getPayments = () => [...this.payments];

    // Services CRUD
    addService = (service: Omit<Service, 'id'>) => {
        const newService = { ...service, id: Math.max(...this.services.map((s) => s.id), 0) + 1 };
        this.services.push(newService);
        return newService;
    };

    updateService = (id: number, updates: Partial<Service>) => {
        const index = this.services.findIndex((s) => s.id === id);
        if (index !== -1) {
            this.services[index] = { ...this.services[index], ...updates } as Service;
            return this.services[index];
        }
        return null;
    };

    deleteService = (id: number) => {
        this.services = this.services.filter((s) => s.id !== id);
    };

    // Branches CRUD
    addBranch = (branch: Omit<Branch, 'id'>) => {
        const newBranch = { ...branch, id: Math.max(...this.branches.map((b) => b.id), 0) + 1 };
        this.branches.push(newBranch);
        return newBranch;
    };

    updateBranch = (id: number, updates: Partial<Branch>) => {
        const index = this.branches.findIndex((b) => b.id === id);
        if (index !== -1) {
            this.branches[index] = { ...this.branches[index], ...updates } as Branch;
            return this.branches[index];
        }
        return null;
    };

    deleteBranch = (id: number) => {
        this.branches = this.branches.filter((b) => b.id !== id);
    };

    // Staff CRUD
    addStaff = (staff: Omit<Staff, 'id'>) => {
        const newStaff = { ...staff, id: Math.max(...this.staff.map((s) => s.id), 0) + 1 };
        this.staff.push(newStaff);
        return newStaff;
    };

    updateStaff = (id: number, updates: Partial<Staff>) => {
        const index = this.staff.findIndex((s) => s.id === id);
        if (index !== -1) {
            this.staff[index] = { ...this.staff[index], ...updates } as Staff;
            return this.staff[index];
        }
        return null;
    };

    deleteStaff = (id: number) => {
        this.staff = this.staff.filter((s) => s.id !== id);
    };

    // Customers CRUD
    addCustomer = (customer: Omit<Customer, 'id'>) => {
        const newCustomer = {
            ...customer,
            id: Math.max(...this.customers.map((c) => c.id), 0) + 1,
        };
        this.customers.push(newCustomer);
        return newCustomer;
    };

    updateCustomer = (id: number, updates: Partial<Customer>) => {
        const index = this.customers.findIndex((c) => c.id === id);
        if (index !== -1) {
            this.customers[index] = { ...this.customers[index], ...updates } as Customer;
            return this.customers[index];
        }
        return null;
    };

    deleteCustomer = (id: number) => {
        this.customers = this.customers.filter((c) => c.id !== id);
    };

    // Appointments CRUD
    addAppointment = (appointment: Omit<Appointment, 'id'>) => {
        const newAppointment = {
            ...appointment,
            id: Math.max(...this.appointments.map((a) => a.id), 0) + 1,
        };
        this.appointments.push(newAppointment);
        return newAppointment;
    };

    updateAppointment = (id: number, updates: Partial<Appointment>) => {
        const index = this.appointments.findIndex((a) => a.id === id);
        if (index !== -1) {
            this.appointments[index] = { ...this.appointments[index], ...updates } as Appointment;
            return this.appointments[index];
        }
        return null;
    };

    deleteAppointment = (id: number) => {
        this.appointments = this.appointments.filter((a) => a.id !== id);
    };

    // Reviews CRUD
    addReview = (review: Omit<Review, 'id'>) => {
        const newReview = { ...review, id: Math.max(...this.reviews.map((r) => r.id), 0) + 1 };
        this.reviews.push(newReview);
        return newReview;
    };

    updateReview = (id: number, updates: Partial<Review>) => {
        const index = this.reviews.findIndex((r) => r.id === id);
        if (index !== -1) {
            this.reviews[index] = { ...this.reviews[index], ...updates } as Review;
            return this.reviews[index];
        }
        return null;
    };

    deleteReview = (id: number) => {
        this.reviews = this.reviews.filter((r) => r.id !== id);
    };

    // Blog Posts CRUD
    addBlogPost = (post: Omit<BlogPost, 'id'>) => {
        const newPost = { ...post, id: Math.max(...this.blogPosts.map((p) => p.id), 0) + 1 };
        this.blogPosts.push(newPost);
        return newPost;
    };

    updateBlogPost = (id: number, updates: Partial<BlogPost>) => {
        const index = this.blogPosts.findIndex((p) => p.id === id);
        if (index !== -1) {
            this.blogPosts[index] = { ...this.blogPosts[index], ...updates } as BlogPost;
            return this.blogPosts[index];
        }
        return null;
    };

    deleteBlogPost = (id: number) => {
        this.blogPosts = this.blogPosts.filter((p) => p.id !== id);
    };

    // Payments CRUD
    addPayment = (payment: Omit<Payment, 'id'>) => {
        const newPayment = { ...payment, id: Math.max(...this.payments.map((p) => p.id), 0) + 1 };
        this.payments.push(newPayment);
        return newPayment;
    };

    updatePayment = (id: number, updates: Partial<Payment>) => {
        const index = this.payments.findIndex((p) => p.id === id);
        if (index !== -1) {
            this.payments[index] = { ...this.payments[index], ...updates } as Payment;
            return this.payments[index];
        }
        return null;
    };

    refundPayment = (id: number) => {
        return this.updatePayment(id, { status: 'refunded' });
    };
}

// Export singleton instance
export const mockDataStore = new MockDataStore();
