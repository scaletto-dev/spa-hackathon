/**
 * AI Blog Generator Modal
 * Modal for generating blog content using AI
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Loader, Copy, Check } from 'lucide-react';
import { generateBlog } from '../../../services/aiApi';

interface AIBlogGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInsert: (content: { title: string; content: string; excerpt: string }) => void;
}

export const AIBlogGeneratorModal: React.FC<AIBlogGeneratorModalProps> = ({
    isOpen,
    onClose,
    onInsert,
}) => {
    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<{
        title: string;
        content: string;
        excerpt: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Vui lòng nhập chủ đề');
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            const keywordArray = keywords
                .split(',')
                .map((k) => k.trim())
                .filter((k) => k.length > 0);

            if (keywordArray.length === 0) {
                keywordArray.push(topic);
            }

            const result = await generateBlog({
                topic,
                keywords: keywordArray,
            });

            setGeneratedContent({
                title: result.title,
                content: result.content,
                excerpt: result.excerpt || '',
            });
        } catch (err) {
            console.error('Blog generation error:', err);
            setError('Không thể tạo nội dung. Vui lòng thử lại.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = async (field: string, text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    const handleInsert = () => {
        if (generatedContent) {
            onInsert(generatedContent);
            onClose();
        }
    };

    const handleClose = () => {
        setTopic('');
        setKeywords('');
        setGeneratedContent(null);
        setError(null);
        onClose();
    };

    const modalContent = (
        <>
            {/* Backdrop - Higher z-index than BlogPostModal */}
            <div className="!fixed !inset-0 !m-0 !p-0 bg-black/50 z-[10999]" />

            {/* Modal Content - Above backdrop */}
            <div
                className="!fixed !inset-0 !m-0 flex items-center justify-center z-[11000] pointer-events-none p-4"
                onClick={handleClose}
            >
                <div
                    className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    AI Blog Generator
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Tạo nội dung blog tự động bằng AI
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {!generatedContent ? (
                            // Input Form
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Chủ đề <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="VD: Cách chăm sóc da mùa hè"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        disabled={isGenerating}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Keywords (phân cách bằng dấu phẩy)
                                    </label>
                                    <input
                                        type="text"
                                        value={keywords}
                                        onChange={(e) => setKeywords(e.target.value)}
                                        placeholder="VD: skincare, summer, UV protection"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        disabled={isGenerating}
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Tối đa 10 keywords. Nếu để trống, AI sẽ tự chọn keywords phù
                                        hợp.
                                    </p>
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            <span>Đang tạo nội dung...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            <span>Tạo nội dung với AI</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            // Generated Content
                            <div className="space-y-6">
                                {/* Title */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Tiêu đề
                                        </label>
                                        <button
                                            onClick={() =>
                                                handleCopy('title', generatedContent.title)
                                            }
                                            className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                                        >
                                            {copiedField === 'title' ? (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    <span>Đã copy</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    <span>Copy</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-gray-900 font-medium">
                                            {generatedContent.title}
                                        </p>
                                    </div>
                                </div>

                                {/* Excerpt */}
                                {generatedContent.excerpt && (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Tóm tắt
                                            </label>
                                            <button
                                                onClick={() =>
                                                    handleCopy('excerpt', generatedContent.excerpt)
                                                }
                                                className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                                            >
                                                {copiedField === 'excerpt' ? (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        <span>Đã copy</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4" />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <p className="text-gray-700 text-sm">
                                                {generatedContent.excerpt}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Content */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nội dung
                                        </label>
                                        <button
                                            onClick={() =>
                                                handleCopy('content', generatedContent.content)
                                            }
                                            className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                                        >
                                            {copiedField === 'content' ? (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    <span>Đã copy</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    <span>Copy</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                                        <div
                                            className="prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{
                                                __html: generatedContent.content,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setGeneratedContent(null)}
                                        className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Tạo lại
                                    </button>
                                    <button
                                        onClick={handleInsert}
                                        className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                                    >
                                        Sử dụng nội dung này
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );

    return createPortal(modalContent, document.body);
};
