// React hooks for accessing mock data store
import { useState, useEffect, useCallback } from 'react';
import { mockDataStore } from '../store/mockDataStore';
import type {
    Service,
    Branch,
    Staff,
    Customer,
    Appointment,
    Review,
    BlogPost,
    Payment,
} from '../store/mockDataStore';

// Services hook
export function useServices() {
    const [services, setServices] = useState<Service[]>([]);

    const refresh = useCallback(() => {
        setServices(mockDataStore.getServices());
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        services,
        addService: (service: Omit<Service, 'id'>) => {
            const newService = mockDataStore.addService(service);
            refresh();
            return newService;
        },
        updateService: (id: number, updates: Partial<Service>) => {
            const updated = mockDataStore.updateService(id, updates);
            refresh();
            return updated;
        },
        deleteService: (id: number) => {
            mockDataStore.deleteService(id);
            refresh();
        },
        refresh,
    };
}

// Branches hook
export function useBranches() {
    const [branches, setBranches] = useState<Branch[]>([]);

    const refresh = useCallback(() => {
        setBranches(mockDataStore.getBranches());
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        branches,
        addBranch: (branch: Omit<Branch, 'id'>) => {
            const newBranch = mockDataStore.addBranch(branch);
            refresh();
            return newBranch;
        },
        updateBranch: (id: number, updates: Partial<Branch>) => {
            const updated = mockDataStore.updateBranch(id, updates);
            refresh();
            return updated;
        },
        deleteBranch: (id: number) => {
            mockDataStore.deleteBranch(id);
            refresh();
        },
        refresh,
    };
}

// Staff hook
export function useStaff() {
    const [staff, setStaff] = useState<Staff[]>([]);

    const refresh = useCallback(() => {
        setStaff(mockDataStore.getStaff());
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        staff,
        addStaff: (member: Omit<Staff, 'id'>) => {
            const newStaff = mockDataStore.addStaff(member);
            refresh();
            return newStaff;
        },
        updateStaff: (id: number, updates: Partial<Staff>) => {
            const updated = mockDataStore.updateStaff(id, updates);
            refresh();
            return updated;
        },
        deleteStaff: (id: number) => {
            mockDataStore.deleteStaff(id);
            refresh();
        },
        refresh,
    };
}

// Customers hook
export function useCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([]);

    const refresh = useCallback(() => {
        setCustomers(mockDataStore.getCustomers());
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        customers,
        addCustomer: (customer: Omit<Customer, 'id'>) => {
            const newCustomer = mockDataStore.addCustomer(customer);
            refresh();
            return newCustomer;
        },
        updateCustomer: (id: number, updates: Partial<Customer>) => {
            const updated = mockDataStore.updateCustomer(id, updates);
            refresh();
            return updated;
        },
        deleteCustomer: (id: number) => {
            mockDataStore.deleteCustomer(id);
            refresh();
        },
        refresh,
    };
}

// Appointments hook
export function useAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const refresh = useCallback(() => {
        setAppointments(mockDataStore.getAppointments());
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        appointments,
        addAppointment: (appointment: Omit<Appointment, 'id'>) => {
            const newAppointment = mockDataStore.addAppointment(appointment);
            refresh();
            return newAppointment;
        },
        updateAppointment: (id: number, updates: Partial<Appointment>) => {
            const updated = mockDataStore.updateAppointment(id, updates);
            refresh();
            return updated;
        },
        deleteAppointment: (id: number) => {
            mockDataStore.deleteAppointment(id);
            refresh();
        },
        refresh,
    };
}

// Reviews hook
export function useReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);

    const refresh = useCallback(() => {
        setReviews(mockDataStore.getReviews());
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        reviews,
        addReview: (review: Omit<Review, 'id'>) => {
            const newReview = mockDataStore.addReview(review);
            refresh();
            return newReview;
        },
        updateReview: (id: number, updates: Partial<Review>) => {
            const updated = mockDataStore.updateReview(id, updates);
            refresh();
            return updated;
        },
        deleteReview: (id: number) => {
            mockDataStore.deleteReview(id);
            refresh();
        },
        refresh,
    };
}

// Blog posts hook
export function useBlogPosts() {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

    const refresh = useCallback(() => {
        setBlogPosts(mockDataStore.getBlogPosts());
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        blogPosts,
        addBlogPost: (post: Omit<BlogPost, 'id'>) => {
            const newPost = mockDataStore.addBlogPost(post);
            refresh();
            return newPost;
        },
        updateBlogPost: (id: number, updates: Partial<BlogPost>) => {
            const updated = mockDataStore.updateBlogPost(id, updates);
            refresh();
            return updated;
        },
        deleteBlogPost: (id: number) => {
            mockDataStore.deleteBlogPost(id);
            refresh();
        },
        refresh,
    };
}

// Payments hook
export function usePayments() {
    const [payments, setPayments] = useState<Payment[]>([]);

    const refresh = useCallback(() => {
        setPayments(mockDataStore.getPayments());
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        payments,
        addPayment: (payment: Omit<Payment, 'id'>) => {
            const newPayment = mockDataStore.addPayment(payment);
            refresh();
            return newPayment;
        },
        updatePayment: (id: number, updates: Partial<Payment>) => {
            const updated = mockDataStore.updatePayment(id, updates);
            refresh();
            return updated;
        },
        refundPayment: (id: number) => {
            const refunded = mockDataStore.refundPayment(id);
            refresh();
            return refunded;
        },
        refresh,
    };
}
