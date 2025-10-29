import React, { useState } from 'react';
import { XIcon, UploadIcon, SparklesIcon } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { Input, Select, Textarea, FormField } from '../../../components/ui';

interface BlogPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function BlogPostModal({ isOpen, onClose, onSuccess }: BlogPostModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'Skincare',
        status: 'Draft',
        image: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        // Validation
        if (!formData.title.trim()) {
            toast.error('Vui lòng nhập tiêu đề bài viết');
            return;
        }
        if (!formData.content.trim()) {
            toast.error('Vui lòng nhập nội dung bài viết');
            return;
        }
        if (formData.content.trim().length < 50) {
            toast.error('Nội dung bài viết phải có ít nhất 50 ký tự');
            return;
        }

        // Mock: Simulate blog post creation
        const newPost = {
            id: Date.now().toString(),
            ...formData,
            author: 'Admin User',
            publishedDate: new Date().toISOString(),
            views: 0,
            likes: 0,
        };

        console.log('📝 Mock: Created blog post:', newPost);
        toast.success(
            `Bài viết "${formData.title}" đã được ${
                formData.status === 'Published' ? 'xuất bản' : 'lưu nháp'
            } thành công! (Mocked)`,
        );

        // Reset form
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            category: 'Skincare',
            status: 'Draft',
            image: '',
        });

        // Close modal
        onClose();

        // Callback
        onSuccess?.();
    };

    const categoryOptions = [
        { value: 'Skincare', label: 'Skincare' },
        { value: 'Wellness', label: 'Wellness' },
        { value: 'Hair Care', label: 'Hair Care' },
        { value: 'Beauty Tips', label: 'Beauty Tips' },
    ];

    const statusOptions = [
        { value: 'Draft', label: 'Draft' },
        { value: 'Published', label: 'Published' },
    ];

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom-4'>
                {/* Header - Sticky */}
                <div className='bg-gradient-to-r from-pink-400 to-purple-400 p-6 rounded-t-3xl flex items-center justify-between flex-shrink-0'>
                    <h2 className='text-xl font-bold text-white'>Tạo bài viết mới</h2>
                    <button onClick={onClose} className='p-1 hover:bg-white/20 rounded-full transition-colors'>
                        <XIcon className='w-6 h-6 text-white' />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className='overflow-y-auto flex-1 p-6 space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Ảnh đại diện</label>
                        <div className='border-2 border-dashed border-pink-200 rounded-2xl p-8 text-center hover:border-pink-300 transition-colors cursor-pointer bg-pink-50/30'>
                            <UploadIcon className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                            <p className='text-sm text-gray-600'>Click để tải lên hoặc kéo thả</p>
                            <p className='text-xs text-gray-500 mt-1'>PNG, JPG tối đa 10MB</p>
                        </div>
                    </div>

                    <FormField label='Tiêu đề bài viết' name='title' required>
                        <Input
                            name='title'
                            value={formData.title}
                            onChange={handleChange}
                            placeholder='Nhập tiêu đề hấp dẫn...'
                        />
                    </FormField>

                    <FormField label='Mô tả ngắn' name='excerpt'>
                        <Textarea
                            name='excerpt'
                            value={formData.excerpt}
                            onChange={handleChange}
                            rows={2}
                            placeholder='Mô tả ngắn gọn về bài viết...'
                        />
                    </FormField>

                    <div>
                        <div className='flex items-center justify-between mb-2'>
                            <label className='block text-sm font-medium text-gray-700'>
                                Nội dung <span className='text-red-500'>*</span>
                            </label>
                            <button
                                type='button'
                                onClick={() => toast.info('Tính năng AI đang được phát triển...')}
                                className='text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1'
                            >
                                <SparklesIcon className='w-3 h-3' />
                                Tạo bằng AI
                            </button>
                        </div>
                        <Textarea
                            name='content'
                            value={formData.content}
                            onChange={handleChange}
                            rows={12}
                            placeholder='Viết nội dung bài viết tại đây...'
                            className='font-mono text-sm'
                        />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <FormField label='Danh mục' name='category'>
                            <Select
                                name='category'
                                value={formData.category}
                                onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                                options={categoryOptions}
                            />
                        </FormField>

                        <FormField label='Trạng thái' name='status'>
                            <Select
                                name='status'
                                value={formData.status}
                                onChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                                options={statusOptions}
                            />
                        </FormField>
                    </div>
                </div>

                {/* Footer - Sticky */}
                <div className='flex-shrink-0 p-6 border-t border-pink-100 rounded-b-3xl flex gap-3'>
                    <button
                        onClick={onClose}
                        className='flex-1 px-4 py-2 rounded-lg border border-pink-200 text-gray-700 hover:bg-pink-50 transition-colors'
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        className='flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm'
                    >
                        {formData.status === 'Published' ? 'Xuất bản' : 'Lưu nháp'}
                    </button>
                </div>
            </div>
        </div>
    );
}
