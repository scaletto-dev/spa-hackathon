import { useState } from 'react';
import { BotIcon, XIcon, SendIcon, SparklesIcon } from 'lucide-react';
export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const suggestions = ["What's our top service this week?", 'Show me customer retention rate', 'Generate appointment summary'];
  return <>
      {isOpen && <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-100 flex flex-col z-50 animate-in slide-in-from-bottom-4">
          <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-4 rounded-t-3xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Assistant</h3>
                <p className="text-white/80 text-xs">Always here to help</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
              <XIcon className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
              <p className="text-sm text-gray-700 mb-3">
                Hi! I'm your AI assistant. I can help you with insights,
                summaries, and recommendations. Try asking me something!
              </p>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => <button key={index} onClick={() => setMessage(suggestion)} className="w-full text-left px-3 py-2 bg-white/60 rounded-lg text-xs text-gray-700 hover:bg-white transition-colors">
                    {suggestion}
                  </button>)}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center flex-shrink-0">
                <BotIcon className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm border border-pink-100 flex-1">
                <p className="text-sm text-gray-700">
                  Your top service this week is "Luxury Facial Treatment" with
                  127 bookings, up 18% from last week!
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-pink-100">
            <div className="flex gap-2">
              <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Ask me anything..." className="flex-1 px-4 py-2 rounded-full bg-pink-50/50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm" />
              <button className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center hover:from-pink-500 hover:to-purple-500 transition-all shadow-sm">
                <SendIcon className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>}
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all z-50 group">
        <BotIcon className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
      </button>
    </>;
}