import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { XIcon, UploadIcon, SparklesIcon } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { Input, Textarea, FormField } from '../../../components/ui';
import { adminBlogAPI, uploadAPI } from '../../../api/adapters/admin';
import { AIBlogGeneratorModal } from '../ai/AIBlogGeneratorModal';

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
    const [showAIModal, setShowAIModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        categoryId: 'general',
        slug: '',
    });

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

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

            // Upload image if new file selected
            let featuredImage = post?.featuredImage || '';
            if (imageFile) {
                try {
                    toast.info('Đang tải ảnh lên...');
                    featuredImage = await uploadAPI.uploadImage(imageFile, 'blog');
                    toast.success('Tải ảnh lên thành công!');
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError);
                    toast.error('Không thể tải ảnh lên. Vui lòng thử lại.');
                    setLoading(false);
                    return;
                }
            }

            if (mode === 'create') {
                await adminBlogAPI.create({
                    title: formData.title,
                    excerpt: formData.excerpt,
                    content: formData.content,
                    categoryId: formData.categoryId,
                    slug: slug,
                    authorId: 'admin', // Default admin ID, backend will override from JWT
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
        } catch (error: unknown) {
            console.error('Blog post error:', error);

            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            // Check for 401 - will be handled by global apiCall interceptor
            // Just show a brief message here
            if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
                toast.error('Phiên đăng nhập hết hạn');
                // apiCall in admin.ts will handle redirect automatically
            } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
                toast.error('Không có quyền thực hiện');
            } else {
                toast.error(errorMessage || 'Lỗi khi lưu bài viết');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <>
            {/* Backdrop - Covers everything including header */}
            <div className='!fixed !inset-0 !m-0 !p-0 bg-black/50 backdrop-blur-sm z-[9999]' />

            {/* Modal Content - Above backdrop */}
            <div
                className='!fixed !inset-0 !m-0 !p-0 flex items-center justify-center z-[10000] pointer-events-none'
                onClick={onClose}
            >
                <div
                    className='bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 pointer-events-auto'
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header - Sticky */}
                    <div className='bg-gradient-to-r from-pink-400 to-purple-400 p-6 rounded-t-3xl flex items-center justify-between flex-shrink-0'>
                        <h2 className='text-xl font-bold text-white'>
                            {mode === 'edit' ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
                        </h2>
                        <button onClick={onClose} className='p-1 hover:bg-white/20 rounded-full transition-colors'>
                            <XIcon className='w-6 h-6 text-white' />
                        </button>
                    </div>

                    {/* AI Generator Button - Prominent */}
                    <div className='px-6 pt-6 pb-4 bg-gradient-to-br from-purple-50 to-pink-50 border-b border-purple-100'>
                        <button
                            type='button'
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowAIModal(true);
                            }}
                            className='w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-medium'
                        >
                            <SparklesIcon className='w-5 h-5 animate-pulse' />
                            <span className='text-base'>✨ Tạo nội dung bằng AI</span>
                            <span className='text-xs bg-white/20 px-2 py-1 rounded-full'>Mới</span>
                        </button>
                        <p className='text-xs text-gray-600 text-center mt-2'>
                            Để AI tạo nội dung chất lượng cao chỉ trong vài giây
                        </p>
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

                        <FormField label='Nội dung' name='content' required>
                            <Textarea
                                name='content'
                                value={formData.content}
                                onChange={handleChange}
                                rows={12}
                                placeholder='Viết nội dung bài viết tại đây... hoặc dùng AI ở trên ✨'
                                className='font-mono text-sm'
                            />
                        </FormField>

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
                            {loading ? 'Đang xử lý...' : mode === 'create' ? 'Tạo bài viết' : 'Cập nhật'}
                        </button>
                    </div>
                </div>

                {/* AI Blog Generator Modal */}
                <AIBlogGeneratorModal
                    isOpen={showAIModal}
                    onClose={() => setShowAIModal(false)}
                    onInsert={(content) => {
                        setFormData((prev) => ({
                            ...prev,
                            title: content.title,
                            excerpt: content.excerpt,
                            content: content.content,
                        }));
                        toast.success('Đã chèn nội dung AI vào form!');
                    }}
                />
            </div>
        </>
    );

    // Render to document.body to escape stacking context
    return createPortal(modalContent, document.body);
}
