/**
 * Reviews API Adapter (MOCK)
 * TODO: Replace with real API integration when backend is ready
 */

// ============= Types =============

export interface Review {
    id: number;
    customerName: string;
    customerAvatar: string;
    service: string;
    rating: number;
    comment: string;
    date: string; // ISO 8601
    branch: string;
    reply?: string;
    replyDate?: string;
    verified: boolean;
}

export interface ReviewsParams {
    page?: number;
    limit?: number;
    serviceId?: number;
    rating?: number; // Filter by rating (1-5)
    sortBy?: 'date' | 'rating';
    sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ReviewsResponse {
    data: Review[];
    meta: PaginationMeta;
    stats: {
        averageRating: number;
        totalReviews: number;
        ratingDistribution: {
            5: number;
            4: number;
            3: number;
            2: number;
            1: number;
        };
    };
}

// ============= Mock Data =============

const MOCK_REVIEWS: Review[] = [
    {
        id: 1,
        customerName: 'Nguyễn Thu Hà',
        customerAvatar: 'https://i.pravatar.cc/150?img=1',
        service: 'AI Skin Analysis Facial',
        rating: 5,
        comment: 'Dịch vụ tuyệt vời! Công nghệ AI phân tích da rất chính xác và nhân viên rất chuyên nghiệp. Da mình cải thiện rõ rệt sau 3 lần điều trị. Chắc chắn sẽ quay lại!',
        date: '2025-10-25T14:30:00Z',
        branch: 'Chi nhánh Trung tâm',
        reply: 'Cảm ơn chị Thu Hà đã tin tưởng và ủng hộ! Rất vui khi thấy làn da của chị cải thiện. Hẹn gặp lại chị trong lần điều trị tiếp theo!',
        replyDate: '2025-10-26T09:00:00Z',
        verified: true,
    },
    {
        id: 2,
        customerName: 'Trần Minh Anh',
        customerAvatar: 'https://i.pravatar.cc/150?img=5',
        service: 'Hydrafacial Treatment',
        rating: 5,
        comment: 'Hydrafacial ở đây thật sự xuất sắc. Không đau, không downtime, da ngay lập tức sáng mịn. Giá cả hợp lý cho chất lượng dịch vụ.',
        date: '2025-10-23T10:15:00Z',
        branch: 'Chi nhánh Tây',
        verified: true,
    },
    {
        id: 3,
        customerName: 'Lê Hoàng Nam',
        customerAvatar: 'https://i.pravatar.cc/150?img=12',
        service: 'Laser Hair Removal',
        rating: 4,
        comment: 'Quy trình triệt lông laser rất chuyên nghiệp. Chỉ hơi đau nhẹ nhưng chấp nhận được. Kết quả tốt sau 4 lần. Trừ 1 sao vì phải đợi lâu một chút.',
        date: '2025-10-20T16:45:00Z',
        branch: 'Chi nhánh Đông',
        reply: 'Cảm ơn anh Nam! Chúng tôi sẽ cải thiện thời gian chờ đợi. Hẹn gặp anh trong buổi hẹn tiếp theo!',
        replyDate: '2025-10-21T08:30:00Z',
        verified: true,
    },
    {
        id: 4,
        customerName: 'Phạm Thùy Linh',
        customerAvatar: 'https://i.pravatar.cc/150?img=9',
        service: 'Botox & Fillers',
        rating: 5,
        comment: 'Bác sĩ tay nghề cao, tiêm rất nhẹ tay. Kết quả tự nhiên, không bị cứng mặt. Mình rất hài lòng với dịch vụ này!',
        date: '2025-10-18T13:20:00Z',
        branch: 'Chi nhánh Trung tâm',
        verified: true,
    },
    {
        id: 5,
        customerName: 'Đỗ Quang Huy',
        customerAvatar: 'https://i.pravatar.cc/150?img=15',
        service: 'Body Contouring',
        rating: 4,
        comment: 'Hiệu quả rõ rệt sau 6 buổi. Vùng bụng giảm 3cm. Dịch vụ tốt nhưng giá hơi cao. Nhân viên tư vấn nhiệt tình.',
        date: '2025-10-15T11:00:00Z',
        branch: 'Chi nhánh Tây',
        verified: true,
    },
    {
        id: 6,
        customerName: 'Vũ Khánh Linh',
        customerAvatar: 'https://i.pravatar.cc/150?img=20',
        service: 'Chemical Peel',
        rating: 5,
        comment: 'Chemical peel ở đây rất ok! Da sáng đều màu, mờ thâm nám sau 2 lần. Nhân viên chăm sóc kỹ càng.',
        date: '2025-10-12T15:30:00Z',
        branch: 'Chi nhánh Đông',
        verified: true,
    },
    {
        id: 7,
        customerName: 'Hoàng Thị Mai',
        customerAvatar: 'https://i.pravatar.cc/150?img=25',
        service: 'AI Skin Analysis Facial',
        rating: 5,
        comment: 'Lần đầu dùng công nghệ AI để phân tích da, cảm thấy rất hiện đại và chính xác. Facial massage rất thư giãn. Recommend 100%!',
        date: '2025-10-10T09:45:00Z',
        branch: 'Chi nhánh Trung tâm',
        reply: 'Cảm ơn chị Mai rất nhiều! Rất vui khi chị hài lòng với trải nghiệm công nghệ AI của chúng tôi!',
        replyDate: '2025-10-11T08:00:00Z',
        verified: true,
    },
    {
        id: 8,
        customerName: 'Ngô Văn Tuấn',
        customerAvatar: 'https://i.pravatar.cc/150?img=33',
        service: 'Laser Skin Rejuvenation',
        rating: 4,
        comment: 'Công nghệ laser hiện đại, kết quả khá tốt. Da mịn màng hơn. Giá hơi mắc nhưng chất lượng xứng đáng.',
        date: '2025-10-08T14:00:00Z',
        branch: 'Chi nhánh Tây',
        verified: true,
    },
    {
        id: 9,
        customerName: 'Bùi Thu Trang',
        customerAvatar: 'https://i.pravatar.cc/150?img=44',
        service: 'Microneedling',
        rating: 5,
        comment: 'Microneedling ở đây làm rất kỹ, da căng mịn hẳn. Sẹo mụn mờ đi nhiều. Sẽ tiếp tục điều trị!',
        date: '2025-10-05T10:30:00Z',
        branch: 'Chi nhánh Đông',
        verified: true,
    },
    {
        id: 10,
        customerName: 'Đinh Hoài An',
        customerAvatar: 'https://i.pravatar.cc/150?img=47',
        service: 'Hydrafacial Treatment',
        rating: 5,
        comment: 'Hydrafacial tuyệt vời, da sáng ngay sau liệu trình. Không gian spa sang trọng, sạch sẽ. Giá hợp lý!',
        date: '2025-10-02T16:20:00Z',
        branch: 'Chi nhánh Trung tâm',
        verified: true,
    },
    {
        id: 11,
        customerName: 'Phan Minh Châu',
        customerAvatar: 'https://i.pravatar.cc/150?img=28',
        service: 'Cellulite Reduction',
        rating: 4,
        comment: 'Giảm cellulite hiệu quả sau 8 buổi. Da săn chắc hơn. Duy nhất là hơi đau khi massage sâu.',
        date: '2025-09-28T11:15:00Z',
        branch: 'Chi nhánh Tây',
        verified: true,
    },
    {
        id: 12,
        customerName: 'Lý Thanh Hương',
        customerAvatar: 'https://i.pravatar.cc/150?img=31',
        service: 'Laser Hair Removal',
        rating: 5,
        comment: 'Triệt lông laser chân rất hiệu quả. Sau 6 lần lông gần như không mọc lại. Nhân viên thân thiện!',
        date: '2025-09-25T13:50:00Z',
        branch: 'Chi nhánh Đông',
        verified: true,
    },
];

// ============= API Functions (MOCK) =============

/**
 * Fetch public reviews with filters and pagination
 * @param params - Query parameters for filtering and pagination
 * @returns Paginated reviews with stats
 *
 * TODO API: GET /api/v1/reviews?page&limit&serviceId&rating&sortBy&sortOrder
 * Auth: Public
 * Response: { data: Review[], meta: PaginationMeta, stats: ReviewStats }
 */
export async function getReviews(params: ReviewsParams = {}): Promise<ReviewsResponse> {
    const { page = 1, limit = 6, serviceId, rating, sortBy = 'date', sortOrder = 'desc' } = params;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Filter reviews
    let filteredReviews = [...MOCK_REVIEWS];

    // Filter by service (using service name contains for simplicity)
    if (serviceId) {
        // In real API, would filter by serviceId. Here we use mock logic
        filteredReviews = filteredReviews.filter((r) => r.id <= serviceId * 2);
    }

    // Filter by rating
    if (rating) {
        filteredReviews = filteredReviews.filter((r) => r.rating === rating);
    }

    // Sort
    filteredReviews.sort((a, b) => {
        if (sortBy === 'date') {
            const comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            return sortOrder === 'desc' ? -comparison : comparison;
        } else {
            // Sort by rating
            const comparison = a.rating - b.rating;
            return sortOrder === 'desc' ? -comparison : comparison;
        }
    });

    // Calculate pagination
    const total = filteredReviews.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredReviews.slice(startIndex, endIndex);

    // Calculate stats
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;
    
    MOCK_REVIEWS.forEach((review) => {
        ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
        totalRating += review.rating;
    });

    const averageRating = totalRating / MOCK_REVIEWS.length;

    return {
        data: paginatedData,
        meta: {
            page,
            limit,
            total,
            totalPages,
        },
        stats: {
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: MOCK_REVIEWS.length,
            ratingDistribution,
        },
    };
}
