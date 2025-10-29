// Global Chat Widget Context - allows opening chat from anywhere
import { createContext, useContext, useState, ReactNode } from 'react';

interface ChatWidgetContextType {
    isOpen: boolean;
    openChat: () => void;
    closeChat: () => void;
    toggleChat: () => void;
}

const ChatWidgetContext = createContext<ChatWidgetContextType | undefined>(undefined);

export function ChatWidgetProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openChat = () => setIsOpen(true);
    const closeChat = () => setIsOpen(false);
    const toggleChat = () => setIsOpen((prev) => !prev);

    return (
        <ChatWidgetContext.Provider value={{ isOpen, openChat, closeChat, toggleChat }}>
            {children}
        </ChatWidgetContext.Provider>
    );
}

export function useChatWidget() {
    const context = useContext(ChatWidgetContext);
    if (!context) {
        throw new Error('useChatWidget must be used within ChatWidgetProvider');
    }
    return context;
}
