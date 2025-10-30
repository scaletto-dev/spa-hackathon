import { useState } from 'react';
import { XIcon, SparklesIcon, SendIcon } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { Textarea } from '../../../components/ui';
import { adminReviewsAPI } from '../../../api/adapters/admin';

interface ReviewReplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    reviewId: number | string;
    onSuccess?: () => void;
}

export function ReviewReplyModal({ isOpen, onClose, reviewId, onSuccess }: ReviewReplyModalProps) {
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const generateAIReply = () => {
        const aiReplies = [
            'Cảm ơn bạn rất nhiều vì đã chia sẻ! Chúng tôi rất vui khi biết bạn có trải nghiệm tuyệt vời. Hy vọng được phục vụ bạn lần sau!',
            'Đánh giá của bạn thật ý nghĩa với chúng tôi! Sự hài lòng của bạn là động lực để team không ngừng cải thiện dịch vụ.',
            'Xin chân thành cảm ơn những lời nhận xét tích cực! Chúng tôi luôn nỗ lực mang đến trải nghiệm tốt nhất cho khách hàng.',
        ];
        const randomIndex = Math.floor(Math.random() * aiReplies.length);
        const randomReply = aiReplies[randomIndex] ?? aiReplies[0] ?? '';
        setReply(randomReply);
        toast.info('Đã tạo câu trả lời bằng AI');
    };

    const handleSubmit = async () => {
        // Validation
        if (!reply.trim()) {
            toast.error('Vui lòng nhập nội dung trả lời');
            return;
        }
        if (reply.trim().length < 10) {
            toast.error('Nội dung trả lời phải có ít nhất 10 ký tự');
            return;
        }
        if (reply.length > 500) {
            toast.error('Nội dung trả lời không được vượt quá 500 ký tự');
            return;
        }

        try {
            setLoading(true);
            await adminReviewsAPI.addResponse(String(reviewId), reply);
            toast.success('Đã gửi phản hồi thành công!');

            // Reset
            setReply('');
            onSuccess?.();
            onClose();
        } catch (err: any) {
            toast.error(err.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom-4'>
                {/* Header */}
                <div className='bg-gradient-to-r from-pink-400 to-purple-400 p-6 rounded-t-3xl flex items-center justify-between flex-shrink-0'>
                    <h2 className='text-xl font-bold text-white'>Phản hồi đánh giá</h2>
                    <button onClick={onClose} className='p-1 hover:bg-white/20 rounded-full transition-colors'>
                        <XIcon className='w-6 h-6 text-white' />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className='overflow-y-auto flex-1 p-6 space-y-4'>
                    <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100'>
                        <div className='flex items-start gap-3'>
                            <img
                                src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
                                alt='Customer'
                                className='w-10 h-10 rounded-full border-2 border-pink-200'
                            />
                            <div className='flex-1'>
                                <h4 className='font-semibold text-gray-800 mb-1'>Sarah Johnson</h4>
                                <p className='text-sm text-gray-700'>
                                    Absolutely amazing experience! The therapist was so professional and the results
                                    were incredible.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='flex items-center justify-between mb-2'>
                            <label className='block text-sm font-medium text-gray-700'>Phản hồi của bạn</label>
                            <button
                                type='button'
                                onClick={generateAIReply}
                                className='text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1'
                            >
                                <SparklesIcon className='w-3 h-3' />
                                Tạo câu trả lời AI
                            </button>
                        </div>
                        <Textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            rows={6}
                            placeholder='Viết phản hồi của bạn tới khách hàng...'
                            maxLength={500}
                            showCounter
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className='flex-shrink-0 p-6 border-t border-pink-100 rounded-b-3xl flex gap-3'>
                    <button
                        onClick={onClose}
                        className='flex-1 px-4 py-2 rounded-lg border border-pink-200 text-gray-700 hover:bg-pink-50 transition-colors'
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className='flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50'
                    >
                        <SendIcon className='w-4 h-4' />
                        {loading ? 'Đang gửi...' : 'Gửi phản hồi'}
                    </button>
                </div>
            </div>
        </div>
    );
}
