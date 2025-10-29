import React from 'react';
import { SearchIcon, BellIcon, BotIcon, ChevronDownIcon } from 'lucide-react';
export function Header() {
  return <header className="h-16 bg-white/80 backdrop-blur-lg border-b border-pink-100 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search patients, services, bookings..." className="w-full pl-10 pr-4 py-2 rounded-full bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent text-sm" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-pink-50 transition-colors group">
          <BotIcon className="w-5 h-5 text-purple-400 group-hover:text-purple-500" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse" />
        </button>
        <button className="relative p-2 rounded-full hover:bg-pink-50 transition-colors">
          <BellIcon className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-400 rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-4 border-l border-pink-100 cursor-pointer hover:bg-pink-50 rounded-full pr-2 py-1 transition-colors">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Admin" className="w-8 h-8 rounded-full border-2 border-pink-200" />
          <span className="text-sm font-medium text-gray-700">Admin</span>
          <ChevronDownIcon className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </header>;
}