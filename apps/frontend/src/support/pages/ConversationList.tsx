import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { SearchIcon, MessageCircleIcon, UserIcon, ClockIcon, Trash2Icon, CheckSquare, Square } from 'lucide-react';
import { Conversation, ConversationFilter } from '../types';
import { useSocket } from '../../contexts/SocketContext';
import { toast } from '../../utils/toast';
import * as supportApi from '../../services/supportApi';

function ConversationList() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { socket, isConnected } = useSocket();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [filter, setFilter] = useState<ConversationFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedConversations, setSelectedConversations] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState(false);
    const fetchingConversationsRef = useRef<Set<string>>(new Set());

    // Fetch conversations from API
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setIsLoading(true);
                // Build query params based on filter
                const params: { status?: string; assignedStaffId?: string } =
                    filter === 'mine'
                        ? { assignedStaffId: 'current-staff-id' } // TODO: Get actual staff ID from auth context
                        : filter === 'all'
                        ? {}
                        : { status: filter.toUpperCase() };
                const data = await supportApi.getConversations(params);

                // Map API response to frontend format
                setConversations(
                    data.map((conv) => {
                        const mapped: Conversation = {
                            id: conv.id,
                            customerName: conv.customerName,
                            lastMessage: conv.lastMessage || 'No messages yet',
                            status: conv.status.toLowerCase() as 'pending' | 'active' | 'closed',
                            unreadCount: conv.unreadCount,
                            createdAt: conv.createdAt,
                            updatedAt: conv.updatedAt,
                        };
                        if (conv.assignedStaffId) {
                            mapped.assignedTo = 'me';
                        }
                        return mapped;
                    }),
                );
            } catch (error) {
                console.error('Failed to fetch conversations:', error);
                toast.error(t('support.toast.failedToLoadConversations'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchConversations();
    }, [filter, t]);

    // Listen for new conversations via socket
    useEffect(() => {
        if (!socket) return;

        socket.on(
            'conversation:new',
            (newConversation: {
                id: string;
                customerName: string;
                status: string;
                lastMessage?: string;
                unreadCount: number;
                createdAt: string;
                updatedAt: string;
            }) => {
                const mappedConv: Conversation = {
                    id: newConversation.id,
                    customerName: newConversation.customerName,
                    lastMessage: newConversation.lastMessage || 'New conversation',
                    status: (newConversation.status?.toLowerCase() || 'pending') as 'pending' | 'active' | 'closed',
                    unreadCount: newConversation.unreadCount || 1,
                    createdAt: newConversation.createdAt,
                    updatedAt: newConversation.updatedAt,
                };
                setConversations((prev) => [mappedConv, ...prev]);
                toast.success(`💬 ${t('support.toast.newChat')} ${newConversation.customerName}`);
            },
        );

        // Listen for conversation updates (new messages)
        socket.on(
            'conversation:updated',
            (data: { conversationId: string; lastMessage: string; timestamp: string }) => {
                setConversations((prev) => {
                    // Check if conversation already exists
                    const exists = prev.some((conv) => conv.id === data.conversationId);

                    if (exists) {
                        // Update existing conversation
                        return prev.map((conv) =>
                            conv.id === data.conversationId
                                ? {
                                      ...conv,
                                      lastMessage: data.lastMessage,
                                      updatedAt: data.timestamp,
                                      unreadCount: conv.unreadCount + 1,
                                  }
                                : conv,
                        );
                    } else {
                        // Conversation not in list - fetch it from API ONCE
                        // Check if already fetching to prevent duplicates
                        if (fetchingConversationsRef.current.has(data.conversationId)) {
                            console.log('⚠️ Already fetching conversation:', data.conversationId);
                            return prev;
                        }

                        // Mark as fetching
                        fetchingConversationsRef.current.add(data.conversationId);
                        console.log('🔄 Fetching new conversation:', data.conversationId);

                        // Use async handler to avoid race condition
                        (async () => {
                            try {
                                const newConv = await supportApi.getConversation(data.conversationId);
                                const mappedConv: Conversation = {
                                    id: newConv.id,
                                    customerName: newConv.customerName,
                                    lastMessage: newConv.lastMessage || 'New conversation',
                                    status: newConv.status.toLowerCase() as 'pending' | 'active' | 'closed',
                                    unreadCount: newConv.unreadCount || 1,
                                    createdAt: newConv.createdAt,
                                    updatedAt: newConv.updatedAt,
                                };

                                // Check again before adding to prevent duplicates
                                setConversations((p) => {
                                    const alreadyExists = p.some((conv) => conv.id === data.conversationId);
                                    if (alreadyExists) {
                                        console.log('⚠️ Conversation already exists, skipping duplicate');
                                        return p;
                                    }
                                    console.log('✅ Adding new conversation to list:', data.conversationId);
                                    return [mappedConv, ...p];
                                });
                            } catch (error) {
                                console.error('Failed to fetch new conversation:', error);
                            } finally {
                                // Remove from fetching set
                                fetchingConversationsRef.current.delete(data.conversationId);
                            }
                        })();
                        return prev;
                    }
                });
            },
        );

        socket.on('message:new', (data: { conversationId: string; message: string }) => {
            setConversations((prev) =>
                prev.map((conv) =>
                    conv.id === data.conversationId
                        ? {
                              ...conv,
                              lastMessage: data.message,
                              unreadCount: conv.unreadCount + 1,
                              updatedAt: new Date().toISOString(),
                          }
                        : conv,
                ),
            );
        });

        socket.on('conversation:assigned', (data: { conversationId: string; staffId: string }) => {
            setConversations((prev) =>
                prev.map((conv) =>
                    conv.id === data.conversationId ? { ...conv, status: 'active', assignedTo: data.staffId } : conv,
                ),
            );
        });

        return () => {
            socket.off('conversation:new');
            socket.off('conversation:updated');
            socket.off('message:new');
            socket.off('conversation:assigned');
            console.log('🧹 Cleaned up conversation list socket listeners');
        };
    }, [socket, t]);

    // Filter conversations
    const filteredConversations = conversations.filter((conv) => {
        // Filter by status
        if (filter === 'active' && conv.status !== 'active') return false;
        if (filter === 'closed' && conv.status !== 'closed') return false;
        if (filter === 'mine' && conv.assignedTo !== 'me') return false;

        // Filter by search
        if (searchQuery && !conv.customerName.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    });

    const handleTakeConversation = async (conversationId: string) => {
        try {
            // Call API to assign conversation
            await supportApi.assignConversation(conversationId, 'current-staff-id');

            // Emit socket event
            if (socket) {
                socket.emit('conversation:assign', { conversationId, staffId: 'current-staff-id' });
            }

            setConversations((prev) =>
                prev.map((conv) =>
                    conv.id === conversationId ? { ...conv, assignedTo: 'me', status: 'active' } : conv,
                ),
            );

            toast.success(t('support.toast.conversationTaken'));
            navigate(`/support-dashboard/chat/${conversationId}`);
        } catch (error) {
            console.error('Failed to assign conversation:', error);
            toast.error(t('support.toast.failedToTake'));
        }
    };

    // Delete handlers - Keep simple with native confirm for now
    const handleDeleteConversation = async (conversationId: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        // Native confirm is simple and works well
        if (!window.confirm(t('support.dashboard.confirmDelete'))) {
            return;
        }

        try {
            setIsDeleting(true);
            await supportApi.deleteConversation(conversationId);
            setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
            toast.success(t('support.dashboard.conversationDeleted'));
        } catch (error) {
            console.error('Failed to delete conversation:', error);
            toast.error('Failed to delete conversation');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleBulkDelete = async () => {
        const count = selectedConversations.size;

        if (!window.confirm(t('support.dashboard.confirmBulkDelete', { count }))) {
            return;
        }

        try {
            setIsDeleting(true);
            await supportApi.bulkDeleteConversations(Array.from(selectedConversations));
            setConversations((prev) => prev.filter((conv) => !selectedConversations.has(conv.id)));
            setSelectedConversations(new Set());
            toast.success(t('support.dashboard.conversationsDeleted', { count }));
        } catch (error) {
            console.error('Failed to delete conversations:', error);
            toast.error('Failed to delete conversations');
        } finally {
            setIsDeleting(false);
        }
    };

    const toggleSelectConversation = (conversationId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedConversations((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(conversationId)) {
                newSet.delete(conversationId);
            } else {
                newSet.add(conversationId);
            }
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedConversations.size === filteredConversations.length) {
            setSelectedConversations(new Set());
        } else {
            setSelectedConversations(new Set(filteredConversations.map((c) => c.id)));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'closed':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const formatTimeAgo = (isoDate: string) => {
        const minutes = Math.floor((Date.now() - new Date(isoDate).getTime()) / 60000);
        if (minutes < 1) return t('support.dashboard.justNow');
        if (minutes < 60) return `${minutes} ${t('support.dashboard.minutesAgo')}`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} ${t('support.dashboard.hoursAgo')}`;
        return `${Math.floor(hours / 24)} ${t('support.dashboard.daysAgo')}`;
    };

    return (
        <div className='flex flex-col h-screen bg-gradient-to-br from-pink-50/30 via-white to-purple-50/30'>
            {/* Header - Modern Glassmorphism */}
            <div className='bg-white/70 backdrop-blur-xl border-b border-gray-200/50 px-4 md:px-6 py-4 shadow-sm'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/30'>
                            <MessageCircleIcon className='w-6 h-6 text-white' />
                        </div>
                        <div>
                            <h1 className='text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent'>
                                {t('support.dashboard.title')}
                            </h1>
                            <p className='text-xs text-gray-500 hidden md:block'>{t('support.dashboard.subtitle')}</p>
                        </div>
                    </div>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className='flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200/50 shadow-sm'
                    >
                        <div
                            className={`w-2.5 h-2.5 rounded-full ${
                                isConnected
                                    ? 'bg-green-500 shadow-lg shadow-green-500/50'
                                    : 'bg-red-500 shadow-lg shadow-red-500/50'
                            } animate-pulse`}
                        />
                        <span className='text-xs md:text-sm font-medium text-gray-700'>
                            {isConnected ? t('support.chat.connected') : t('support.chat.disconnected')}
                        </span>
                    </motion.div>
                </div>

                {/* Search Bar - Enhanced */}
                <div className='relative group'>
                    <SearchIcon className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-pink-500 transition-colors' />
                    <input
                        type='text'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('support.dashboard.search')}
                        className='w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-300 transition-all shadow-sm hover:shadow-md text-sm'
                    />
                </div>
            </div>

            {/* Filter Tabs - Mobile Friendly with Overflow Scroll */}
            <div className='bg-white/70 backdrop-blur-xl border-b border-gray-200/50 px-4 md:px-6 py-3 overflow-x-auto scrollbar-hide'>
                <div className='flex gap-2 min-w-max md:min-w-0'>
                    {(['all', 'active', 'mine', 'closed'] as ConversationFilter[]).map((f) => (
                        <motion.button
                            key={f}
                            onClick={() => setFilter(f)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 md:px-6 py-2 rounded-xl font-medium transition-all shadow-sm ${
                                filter === f
                                    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white shadow-lg shadow-pink-500/30'
                                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-50 border border-gray-200/50'
                            }`}
                        >
                            {t(`support.dashboard.filters.${f}`)}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Bulk Action Bar - Appears when conversations are selected */}
            {selectedConversations.size > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className='bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 px-4 md:px-6 py-3 flex items-center justify-between'
                >
                    <div className='flex items-center gap-3'>
                        <button
                            onClick={toggleSelectAll}
                            className='text-white hover:text-pink-100 transition-colors'
                            title='Toggle Select All'
                        >
                            {selectedConversations.size === filteredConversations.length ? (
                                <CheckSquare className='w-5 h-5' />
                            ) : (
                                <Square className='w-5 h-5' />
                            )}
                        </button>
                        <span className='text-white font-medium'>
                            {selectedConversations.size}{' '}
                            {t('support.dashboard.selected', { count: selectedConversations.size })}
                        </span>
                    </div>
                    <motion.button
                        onClick={handleBulkDelete}
                        disabled={isDeleting}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        <Trash2Icon className='w-4 h-4' />
                        <span className='font-medium'>{t('support.dashboard.deleteSelected')}</span>
                    </motion.button>
                </motion.div>
            )}

            {/* Conversation List - Enhanced with Glass Cards */}
            <div className='flex-1 overflow-y-auto p-4 md:p-6'>
                <div className='max-w-5xl mx-auto space-y-3'>
                    {isLoading ? (
                        <div className='flex items-center justify-center py-12'>
                            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500'></div>
                        </div>
                    ) : filteredConversations.length > 0 ? (
                        filteredConversations.map((conversation, index) => (
                            <motion.div
                                key={conversation.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.01, y: -2 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => navigate(`/support-dashboard/chat/${conversation.id}`)}
                                className='bg-white/80 backdrop-blur-lg rounded-2xl p-4 md:p-5 shadow-md hover:shadow-xl border border-gray-200/50 cursor-pointer transition-all group'
                            >
                                <div className='flex items-start justify-between gap-3'>
                                    {/* Checkbox for selection */}
                                    <button
                                        onClick={(e) => toggleSelectConversation(conversation.id, e)}
                                        className='flex-shrink-0 mt-1 text-gray-400 hover:text-pink-500 transition-colors'
                                        title='Select conversation'
                                    >
                                        {selectedConversations.has(conversation.id) ? (
                                            <CheckSquare className='w-5 h-5 text-pink-500' />
                                        ) : (
                                            <Square className='w-5 h-5' />
                                        )}
                                    </button>

                                    <div className='flex items-start gap-3 flex-1 min-w-0'>
                                        {/* Avatar - Enhanced with Gradient Ring */}
                                        <div className='relative flex-shrink-0'>
                                            <div className='w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-pink-400 via-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:shadow-pink-500/50 transition-shadow'>
                                                <UserIcon className='w-6 h-6 md:w-7 md:h-7 text-white' />
                                            </div>
                                            {conversation.status === 'active' && (
                                                <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm' />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className='flex-1 min-w-0'>
                                            <div className='flex flex-wrap items-center gap-2 mb-1.5'>
                                                <h3 className='font-semibold text-gray-900 text-base md:text-lg truncate'>
                                                    {conversation.customerName}
                                                </h3>
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getStatusColor(
                                                        conversation.status,
                                                    )} backdrop-blur-sm shadow-sm`}
                                                >
                                                    {t(`support.dashboard.stats.${conversation.status}`)}
                                                </motion.span>
                                            </div>
                                            <p className='text-sm text-gray-600 line-clamp-2 mb-2 group-hover:text-gray-900 transition-colors'>
                                                {conversation.lastMessage}
                                            </p>
                                            <div className='flex items-center gap-2 text-xs text-gray-500'>
                                                <ClockIcon className='w-3.5 h-3.5' />
                                                <span>{formatTimeAgo(conversation.updatedAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions - Right Side */}
                                    <div className='flex flex-col items-end gap-2 flex-shrink-0'>
                                        {conversation.unreadCount > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                whileHover={{ scale: 1.1 }}
                                                className='bg-gradient-to-br from-pink-500 to-pink-600 text-white text-xs font-bold rounded-full min-w-[24px] h-6 px-2 flex items-center justify-center shadow-lg shadow-pink-500/40'
                                            >
                                                {conversation.unreadCount}
                                            </motion.span>
                                        )}
                                        <div className='flex items-center gap-2'>
                                            {/* Delete Button */}
                                            <motion.button
                                                onClick={(e) => handleDeleteConversation(conversation.id, e)}
                                                disabled={isDeleting}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                                                title={t('support.dashboard.deleteConversation')}
                                            >
                                                <Trash2Icon className='w-4 h-4' />
                                            </motion.button>
                                            {conversation.status === 'pending' && (
                                                <motion.button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleTakeConversation(conversation.id);
                                                    }}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className='px-4 py-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white text-xs font-medium rounded-xl hover:shadow-lg shadow-pink-500/30 transition-all'
                                                >
                                                    {t('support.dashboard.take')}
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className='text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-300'
                        >
                            <div className='w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
                                <MessageCircleIcon className='w-10 h-10 text-gray-400' />
                            </div>
                            <p className='text-gray-500 font-medium'>{t('support.dashboard.noConversations')}</p>
                            <p className='text-sm text-gray-400 mt-1'>{t('support.dashboard.noConversationsDesc')}</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ConversationList;
