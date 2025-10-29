import React from 'react';
import { BotIcon, TrendingUpIcon, ClockIcon, UsersIcon } from 'lucide-react';
const insights = [{
  icon: TrendingUpIcon,
  text: 'Peak booking time: 10 AM – 12 PM',
  color: 'text-pink-500'
}, {
  icon: ClockIcon,
  text: 'High demand predicted for 3-5 PM today',
  color: 'text-purple-500'
}, {
  icon: UsersIcon,
  text: '15% increase in new member signups this week',
  color: 'text-rose-500'
}];
export function AIInsightsPanel() {
  return <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center">
          <BotIcon className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">AI Insights</h3>
        <span className="ml-auto w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse" />
      </div>
      <div className="space-y-3">
        {insights.map((insight, index) => <div key={index} className="flex items-start gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-pink-100">
            <insight.icon className={`w-5 h-5 ${insight.color} flex-shrink-0 mt-0.5`} />
            <p className="text-sm text-gray-700">{insight.text}</p>
          </div>)}
      </div>
      <button className="w-full mt-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl text-sm font-medium hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm">
        View All Insights
      </button>
    </div>;
}