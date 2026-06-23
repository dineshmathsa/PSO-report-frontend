import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Paperclip, FileDown } from 'lucide-react';

const ChatInput = ({ onSendMessage, onSendReport, isLoading }) => {
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isLoading) return;
    if (!input.trim()) return;

    onSendMessage(input.trim());
    setInput('');
  };

  const handleGenerateReport = async () => {
    if (isLoading || !selectedFile || !onSendReport) return;
    await onSendReport(input.trim() || 'Generate PSO report', selectedFile);
    setInput('');
    clearSelectedFile();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 py-4 md:px-6 bg-gradient-to-t from-[#0b0f19] to-transparent border-t border-slate-800/40">
      {selectedFile && (
        <div className="max-w-3xl mx-auto mb-2 flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
          <Paperclip className="w-3.5 h-3.5" />
          <span className="truncate">Excel attached: {selectedFile.name}</span>
          <button
            type="button"
            onClick={handleGenerateReport}
            disabled={isLoading}
            className="ml-2 inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            <FileDown className="w-3 h-3" />
            Generate PDF
          </button>
          <button
            type="button"
            onClick={clearSelectedFile}
            className="ml-auto text-slate-400 hover:text-white"
          >
            Remove
          </button>
        </div>
      )}

      <div className="max-w-3xl mx-auto relative flex items-end bg-slate-900 border border-slate-800 rounded-2xl focus-within:border-indigo-500/80 transition-colors pl-4 pr-2 py-2.5">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors shrink-0"
          title="Attach Excel for report generation"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            selectedFile
              ? 'Ask a question about the report, or click Generate PDF...'
              : 'Ask about portfolio health, RAG status, or attach Excel to generate a PDF...'
          }
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
        Attach Excel and click <strong>Generate PDF</strong> to create a report. Use the send button to ask follow-up questions.
      </p>
    </form>
  );
};

export default ChatInput;
