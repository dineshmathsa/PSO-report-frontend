import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowUp } from 'lucide-react';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea heights
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 py-4 md:px-6 bg-gradient-to-t from-[#0b0f19] to-transparent border-t border-slate-800/40">
      <div className="max-w-3xl mx-auto relative flex items-end bg-slate-900 border border-slate-800 rounded-2xl focus-within:border-indigo-500/80 transition-colors pl-4 pr-2 py-2.5">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask for an executive report or analyze PSO performance metrics..."
          disabled={isLoading}
          rows={1}
          className="flex-1 max-h-[180px] bg-transparent outline-none border-none resize-none text-slate-100 placeholder-slate-500 text-sm py-1.5 focus:ring-0 leading-relaxed max-w-full block scrollbar-none"
        />
        
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`p-2 rounded-xl transition-all duration-200 shrink-0 ${
            input.trim() && !isLoading
              ? 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-[1.02] shadow-md shadow-indigo-600/20'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          <ArrowUp className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
      <p className="text-[10px] text-center text-slate-500 mt-2">
        AI Executive Reporter can generate drafts and summaries. Please verify critical financial metrics.
      </p>
    </form>
  );
};

export default ChatInput;
