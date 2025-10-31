/**
 * Sentiment Dashboard Widget
 * Displays AI-powered sentiment analysis summary for reviews
 */

import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, MessageSquare, Star, Sparkles } from 'lucide-react';
import { getSentimentSummary, SentimentSummary } from '../../../services/aiApi';

interface SentimentDashboardProps {
    period?: 'week' | 'month' | 'year';
    onPeriodChange?: (period: 'week' | 'month' | 'year') => void;
}

export const SentimentDashboard: React.FC<SentimentDashboardProps> = ({
    period = 'month',
    onPeriodChange,
}) => {
    const [data, setData] = useState<SentimentSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadSentimentData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const summary = await getSentimentSummary(period);
                if (isMounted) {
                    setData(summary);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Failed to load sentiment summary:', err);
                    setError('Không thể tải dữ liệu sentiment');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadSentimentData();

        return () => {
            isMounted = false;
        };
    }, [period]);

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center text-red-600">{error || 'Không có dữ liệu'}</div>
            </div>
        );
    }

    const sentimentColor =
        data.overall.sentiment === 'positive'
            ? 'text-green-600'
            : data.overall.sentiment === 'negative'
              ? 'text-red-600'
              : 'text-yellow-600';

    const sentimentBg =
        data.overall.sentiment === 'positive'
            ? 'bg-green-50'
            : data.overall.sentiment === 'negative'
              ? 'bg-red-50'
              : 'bg-yellow-50';

    const sentimentIcon = data.overall.score > 70 ? TrendingUp : TrendingDown;
    const SentimentIcon = sentimentIcon;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">AI Sentiment Analysis</h3>
                </div>

                {/* Period Selector */}
                {onPeriodChange && (
                    <select
                        value={period}
                        onChange={(e) =>
                            onPeriodChange(e.target.value as 'week' | 'month' | 'year')
                        }
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="week">7 ngày</option>
                        <option value="month">30 ngày</option>
                        <option value="year">1 năm</option>
                    </select>
                )}
            </div>

            {/* Overall Sentiment */}
            <div className={`${sentimentBg} rounded-lg p-4 mb-6`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Tổng quan</p>
                        <div className="flex items-center gap-2">
                            <SentimentIcon className={`w-5 h-5 ${sentimentColor}`} />
                            <span className={`text-2xl font-bold ${sentimentColor} capitalize`}>
                                {data.overall.sentiment === 'positive'
                                    ? 'Tích cực'
                                    : data.overall.sentiment === 'negative'
                                      ? 'Tiêu cực'
                                      : 'Trung bình'}
                            </span>
                            <span className="text-sm text-gray-500">({data.overall.score}%)</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Thay đổi</p>
                        <span className="text-lg font-semibold text-green-600">
                            {data.overall.change}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">Đánh giá TB</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{data.avgRating.toFixed(1)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-600">Tổng reviews</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{data.totalReviews}</p>
                </div>
            </div>

            {/* Breakdown */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Chi tiết đánh giá</h4>
                <div className="space-y-3">
                    {[
                        { label: 'Dịch vụ', value: data.breakdown.service, key: 'service' },
                        { label: 'Nhân viên', value: data.breakdown.staff, key: 'staff' },
                        { label: 'Vệ sinh', value: data.breakdown.cleanliness, key: 'cleanliness' },
                        { label: 'Giá trị', value: data.breakdown.value, key: 'value' },
                    ].map((item) => (
                        <div key={item.key}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-600">{item.label}</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {(item.value * 100).toFixed(0)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${
                                        item.value > 0.8
                                            ? 'bg-green-500'
                                            : item.value > 0.6
                                              ? 'bg-yellow-500'
                                              : 'bg-red-500'
                                    }`}
                                    style={{ width: `${item.value * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Insights */}
            <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">AI Insights</h4>
                <div className="space-y-2">
                    {data.trends.map((trend, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-purple-600 mt-0.5">•</span>
                            <span>{trend}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
