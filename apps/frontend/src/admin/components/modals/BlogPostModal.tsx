import React, { useState, useEffect, useRef } from 'react';
import { XIcon, UploadIcon, SparklesIcon } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { Input, Textarea, FormField } from '../../../components/ui';
import { adminBlogAPI } from '../../../api/adapters/admin';

interface BlogPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    post?: any;
    mode?: 'create' | 'edit';
}

export function BlogPostModal({ isOpen, onClose, onSuccess, post, mode = 'create' }: BlogPostModalProps) {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [featuredImageUrl, setFeaturedImageUrl] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        categoryId: 'general',
        slug: '',
    });

    // Update form data when post prop changes (for edit mode)
    useEffect(() => {
        if (post && mode === 'edit') {
            setFormData({
                title: post.title || '',
                excerpt: post.excerpt || '',
                content: post.content || '',
                categoryId: post.categoryId || 'general',
                slug: post.slug || '',
            });
            setImagePreview(post.featuredImage || '');
            setFeaturedImageUrl(post.featuredImage || '');
        } else {
            // Reset form for create mode
            setFormData({
                title: '',
                excerpt: '',
                content: '',
                categoryId: 'general',
                slug: '',
            });
            setImagePreview('');
            setFeaturedImageUrl('');
            setImageFile(null);
        }
    }, [post, mode, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('Kích thước ảnh không được vượt quá 10MB');
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('Kích thước ảnh không được vượt quá 10MB');
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            toast.error('Vui lòng chọn file ảnh (PNG, JPG)');
        }
    };

    const handleSubmit = async () => {
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

        try {
            setLoading(true);
            const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-');
            
            // TODO: Implement actual file upload to server
            // For now, use base64 preview or existing URL
            const featuredImage = imagePreview || post?.featuredImage || '';
            
            if (mode === 'create') {
                await adminBlogAPI.create({
                    title: formData.title,
                    excerpt: formData.excerpt,
                    content: formData.content,
                    categoryId: formData.categoryId,
                    slug: slug,
                    authorId: 'admin', // Will be set by backend
                    ...(featuredImage && { featuredImage }),
                });
                toast.success('Bài viết đã được tạo thành công!');
            } else {
                await adminBlogAPI.update(post.id, {
                    title: formData.title,
                    excerpt: formData.excerpt,
                    content: formData.content,
                    categoryId: formData.categoryId,
                    slug: slug,
                    ...(featuredImage && { featuredImage }),
                });
                toast.success('Bài viết đã được cập nhật thành công!');
            }

            // Reset form
            setFormData({
                title: '',
                excerpt: '',
                content: '',
                categoryId: 'general',
                slug: '',
            });

            // Close modal
            onClose();

            // Callback
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom-4'>
                {/* Header - Sticky */}
                <div className='bg-gradient-to-r from-pink-400 to-purple-400 p-6 rounded-t-3xl flex items-center justify-between flex-shrink-0'>
                    <h2 className='text-xl font-bold text-white'>
                        {mode === 'edit' ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
                    </h2>
                    <button onClick={onClose} className='p-1 hover:bg-white/20 rounded-full transition-colors'>
                        <XIcon className='w-6 h-6 text-white' />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className='overflow-y-auto flex-1 p-6 space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Ảnh đại diện</label>
                        <input
                            ref={fileInputRef}
                            type='file'
                            accept='image/*'
                            onChange={handleImageChange}
                            className='hidden'
                        />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className='border-2 border-dashed border-pink-200 rounded-2xl p-8 text-center hover:border-pink-300 transition-colors cursor-pointer bg-pink-50/30'
                        >
                            {imagePreview ? (
                                <div className='relative'>
                                    <img src={imagePreview} alt='Preview' className='max-h-48 mx-auto rounded-lg' />
                                    <p className='text-xs text-gray-500 mt-2'>Click để thay đổi ảnh</p>
                                </div>
                            ) : (
                                <>
                                    <UploadIcon className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                                    <p className='text-sm text-gray-600'>Click để tải lên hoặc kéo thả</p>
                                    <p className='text-xs text-gray-500 mt-1'>PNG, JPG tối đa 10MB</p>
                                </>
                            )}
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
                        <FormField label='Danh mục' name='categoryId'>
                            <select
                                name='categoryId'
                                value={formData.categoryId}
                                onChange={handleChange}
                                className='w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300'
                            >
                                <option value='general'>General</option>
                                <option value='skincare'>Skincare</option>
                                <option value='wellness'>Wellness</option>
                                <option value='hair-care'>Hair Care</option>
                                <option value='beauty-tips'>Beauty Tips</option>
                            </select>
                        </FormField>

                        <FormField label='URL Slug' name='slug'>
                            <Input
                                name='slug'
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder='Để trống để auto-generate'
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
                        disabled={loading}
                        className='flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm disabled:opacity-50'
                    >
                        {loading ? 'Đang xử lý...' : (mode === 'create' ? 'Tạo bài viết' : 'Cập nhật')}
                    </button>
                </div>
            </div>
        </div>
    );
}
