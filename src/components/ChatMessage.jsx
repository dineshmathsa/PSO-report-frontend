import React from 'react';
import { User, Sparkles, FileSpreadsheet } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const { role, content } = message;
  const isUser = role === 'user';

  // Basic formatter to handle basic markdown-like structures: code blocks, bold text, lists, and line breaks
  const formatContent = (text) => {
    if (!text) return '';
    
    // Split by code blocks first
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      // Check if it's a code block
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        // Extract language if specified on the first line
        const possibleLang = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : '';
        const codeText = possibleLang ? lines.slice(1).join('\n') : lines.join('\n');
        
        return (
          <div key={index} className="my-3 overflow-x-auto rounded-lg bg-slate-950 p-4 border border-slate-800 text-xs font-mono text-emerald-400">
            {possibleLang && (
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-900 pb-1 font-semibold">
                {possibleLang}
              </div>
            )}
            <pre className="whitespace-pre-wrap">{codeText}</pre>
          </div>
        );
      }

      // Handle normal paragraphs, bold formatting, and bullet lists
      const lines = part.split('\n');
      return lines.map((line, lineIdx) => {
        // Bullet points
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          const content = line.trim().substring(2);
          return (
            <ul key={`${index}-${lineIdx}`} className="list-disc pl-5 my-1 text-slate-200 text-sm">
              <li>{parseBold(content)}</li>
            </ul>
          );
        }

        // Return empty line spacer
        if (line.trim() === '') {
          return <div key={`${index}-${lineIdx}`} className="h-2" />;
        }

        return (
          <p key={`${index}-${lineIdx}`} className="text-sm text-slate-200 leading-relaxed my-1">
            {parseBold(line)}
          </p>
        );
      });
    });
  };

  // Helper to convert **text** to <strong>text</strong>
  const parseBold = (text) => {
    const regex = /\*\*(.*?)\*\*/g;
    const parts = text.split(regex);
    if (parts.length === 1) return text;
    
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-semibold text-white">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`flex w-full gap-4 py-4 px-4 md:px-6 transition-colors ${
      isUser ? 'justify-end' : 'bg-slate-900/30 border-y border-slate-900/40 justify-start'
    }`}>
      <div className={`flex max-w-3xl gap-4 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-md ${
          isUser
            ? 'bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white'
            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        }`}>
          {isUser ? (
            <User className="w-4 h-4" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </div>

        {/* Bubble content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-slate-300">
              {isUser ? 'You' : 'Reporting Assistant'}
            </span>
            <span className="text-[10px] text-slate-500">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <div className={`space-y-1 ${isUser ? 'bg-indigo-600/15 border border-indigo-500/25 px-4 py-3 rounded-2xl rounded-tr-none' : ''}`}>
            {formatContent(content)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
